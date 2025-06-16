import React, { useEffect, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useIntersectionObserver, useIsFirstRender } from "@uidotdev/usehooks";
import { useFetcher, useSearchParams } from "react-router";

import type { Route } from "./+types/users";
import { getUsers } from "~/lib/api";
import { Sidebar } from "~/components/ui/Sidebar";
import { Card } from "~/components/ui/Card";
import { Search } from "~/components/ui/Search";
import { getSelectedFilters } from "~/lib/utils";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Presight exercise 1" },
    { name: "description", content: "Search and list users!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const users = await getUsers(request);
  return users;
}

/**
 * NOTE: This was a somewhat rushed implementation, so possibly not the cleanest solution, although it is a working example. Would need more time for QA to catch bugs and address issues.
 * TODO: 1. Improve filter selection logic to address bug with filters after reloading browser. 2. Enhance searchbar component. 3. General code clean up/refactor.
 *
 */

export default function Users({ loaderData }: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const parentRef = React.useRef(null);
  const { users: initalUsers, filters, nextPage: initialNextPage } = loaderData;

  const [data, setData] = useState({
    users: initalUsers,
    page: initialNextPage,
  });

  const { users, page } = data;

  const fetcher = useFetcher<Awaited<typeof getUsers>>();
  const isFirstRender = useIsFirstRender();
  const [observerRef, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
  });

  const rowVirtualizer = useVirtualizer({
    count: users.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  });

  async function handleAppendUsers() {
    const filterValue = JSON.stringify(getSelectedFilters(searchParams));
    const fp = filterValue ? `&filters=${filterValue}` : "";

    if (fetcher.state === "loading") {
      return;
    }

    fetcher.load(`?index&page=${page}${fp}`);

    if (fetcher.data) {
      const newUsers = fetcher.data.users;
      setData((prev) => ({
        users: [...prev.users, ...newUsers],
        page: prev.page + 1,
      }));
    }
  }

  function handleUpdateUsers({
    hobbies,
    nationalities,
  }: {
    hobbies: string[];
    nationalities: string[];
  }) {
    const filterValue = JSON.stringify({
      hobbies,
      nationalities,
    });

    if (hobbies.length || nationalities.length) {
      setSearchParams(`?filters=${filterValue}`);
    } else {
      searchParams.delete("filters");
      setSearchParams(searchParams);
    }
  }

  useEffect(() => {
    if (isFirstRender) {
      return;
    }
    setData({
      users: initalUsers,
      page: initialNextPage,
    });
  }, [loaderData]);

  useEffect(() => {
    if (entry?.isIntersecting) {
      handleAppendUsers();
    }
  }, [entry?.isIntersecting]);

  return (
    <>
      <div className="container px-6 m-auto">
        <div className="grid grid-cols-4 gap-6 md:grid-cols-8 lg:grid-cols-12">
          <aside className="col-span-4 lg:col-span-3">
            <Sidebar
              handleUpdateFilters={handleUpdateUsers}
              hobbies={filters.topHobbies}
              nationalities={filters.nationalities}
            />
          </aside>
          <div className="col-span-4 lg:col-span-9" ref={parentRef}>
            <section className="max-w-[50%]">
              <Search />
            </section>
            <section className="pt-8 flex flex-col gap-10">
              {rowVirtualizer.getVirtualItems().map((item) => {
                const user = users[item.index];
                return (
                  <Card
                    key={item.index}
                    user={user}
                    observerRef={
                      users.length === item.index + 1 ? observerRef : null
                    }
                  />
                );
              })}
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
