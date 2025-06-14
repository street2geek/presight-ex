import React, { useEffect, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { useFetcher, useSearchParams } from "react-router";

import type { Route } from "./+types/users";
import { getUsers } from "~/lib/api";
import { updateFilterParams } from "~/lib/utils";
import { Sidebar } from "~/components/ui/Sidebar";
import { Card } from "~/components/ui/Card";
import { Search } from "~/components/ui/Search";

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

export default function Users({ loaderData }: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const parentRef = React.useRef(null);
  const { users: initalUsers, filters } = loaderData;
  const [users, setUsers] = useState(initalUsers);

  const fetcher = useFetcher<Awaited<typeof getUsers>>();
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

  function handleUpdateFilters() {
    const newParams = updateFilterParams(searchParams);
  }

  async function handleUpdateUsers() {
    if (fetcher.state === "loading") {
      return;
    }

    fetcher.load(`?index`);

    console.log(fetcher.data);

    if (fetcher.data) {
      const newUsers = fetcher.data.users;
      setUsers((prevUsers) => [...prevUsers, ...newUsers]);
    }
  }

  useEffect(() => {
    if (entry?.isIntersecting) {
      handleUpdateUsers();
    }
  }, [entry?.isIntersecting]);

  return (
    <>
      <div className="container px-6 m-auto">
        <div className="grid grid-cols-4 gap-6 md:grid-cols-8 lg:grid-cols-12">
          <aside className="col-span-4 lg:col-span-3">
            <Sidebar
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
