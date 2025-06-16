import { useState } from "react";
import { useSearchParams } from "react-router";
import { isFilter, updateFilters } from "~/lib/utils";

type SidebarPops = {
  hobbies: string[];
  nationalities: string[];
  handleUpdateFilters: (arg: {
    hobbies: string[];
    nationalities: string[];
  }) => void;
};

export function Sidebar({
  hobbies,
  nationalities,
  handleUpdateFilters,
}: SidebarPops) {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [searchParams] = useSearchParams();

  function handleUpdateNationalites(selectedItem: string) {
    const params = searchParams.get("filters");
    let selectedNationalities = [];
    let selectedHobbies = [];
    if (params) {
      selectedNationalities = JSON.parse(params).nationalities;
      selectedHobbies = JSON.parse(params).hobbies;
    }

    const updatedNationalities = updateFilters(
      selectedNationalities,
      selectedItem
    );

    handleUpdateFilters({
      hobbies: selectedHobbies,
      nationalities: updatedNationalities,
    });
  }

  function handleUpdateHobbies(selectedItem: string) {
    const params = searchParams.get("filters");
    let selectedNationalities = [];
    let selectedHobbies = [];
    if (params) {
      selectedNationalities = JSON.parse(params).nationalities;
      selectedHobbies = JSON.parse(params).hobbies;
    }
    const updatedHobbies = updateFilters(selectedHobbies, selectedItem);

    handleUpdateFilters({
      hobbies: updatedHobbies,
      nationalities: selectedNationalities,
    });
  }

  return (
    <>
      {/*  <!-- Mobile trigger --> */}
      <button
        title="Side navigation"
        type="button"
        className={`visible fixed left-6 top-6 z-40 order-10 block h-10 w-10 self-center rounded bg-white opacity-100 lg:hidden ${
          isSideNavOpen
            ? "visible opacity-100 [&_span:nth-child(1)]:w-6 [&_span:nth-child(1)]:translate-y-0 [&_span:nth-child(1)]:rotate-45 [&_span:nth-child(3)]:w-0 [&_span:nth-child(2)]:-rotate-45 "
            : ""
        }`}
        aria-haspopup="menu"
        aria-label="Side navigation"
        aria-expanded={isSideNavOpen ? true : false}
        aria-controls="nav-menu-2"
        onClick={() => setIsSideNavOpen(!isSideNavOpen)}
      >
        <div className="absolute top-1/2 left-1/2 w-6 -translate-x-1/2 -translate-y-1/2 transform">
          <span
            aria-hidden="true"
            className="absolute block h-0.5 w-9/12 -translate-y-2 transform rounded-full bg-slate-700 transition-all duration-300"
          ></span>
          <span
            aria-hidden="true"
            className="absolute block h-0.5 w-6 transform rounded-full bg-slate-900 transition duration-300"
          ></span>
          <span
            aria-hidden="true"
            className="absolute block h-0.5 w-1/2 origin-top-left translate-y-2 transform rounded-full bg-slate-900 transition-all duration-300"
          ></span>
        </div>
      </button>

      {/*  <!-- Side Navigation --> */}
      <aside
        id="nav-menu-2"
        aria-label="Side navigation"
        className={`fixed top-0 bottom-0 left-0 z-40 flex w-72 flex-col border-r border-r-slate-200 bg-white transition-transform lg:translate-x-0 ${
          isSideNavOpen ? "translate-x-0" : " -translate-x-full"
        }`}
      >
        <a
          aria-label="logo"
          className="flex text-slate-700 items-center gap-2 whitespace-nowrap p-6 text-xl font-medium focus:outline-none"
          href="javascript:void(0)"
        >
          Filter By:
        </a>
        <nav
          aria-label="side navigation"
          className="flex-1 divide-y divide-slate-100 overflow-auto"
        >
          <div className="pb-4">
            <h4 className="pl-6 my-4 underline text-slate-700">Hobbies</h4>
            <ul className="flex flex-1 flex-col gap-1 py-3 h-[280px] scroll-auto overflow-auto">
              {hobbies?.sort().map((hob) => (
                <li
                  key={hob}
                  className="px-6 relative flex flex-wrap items-center"
                >
                  <input
                    className="w-4 h-4 transition-colors bg-white border-2 rounded appearance-none cursor-pointer focus-visible:outline-none peer border-slate-500 checked:border-emerald-500 checked:bg-emerald-500 checked:hover:border-emerald-600 checked:hover:bg-emerald-600 focus:outline-none checked:focus:border-emerald-700 checked:focus:bg-emerald-700 disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-50"
                    type="checkbox"
                    id={hob}
                    onChange={() => handleUpdateHobbies(hob)}
                    defaultChecked={isFilter(
                      searchParams.get("filters"),
                      hob,
                      "hobbies"
                    )}
                  />
                  <label
                    className="pl-2 cursor-pointer text-slate-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400"
                    htmlFor={hob}
                  >
                    {hob}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="">
            <h4 className="pl-6 my-4 underline text-slate-700">Nationality</h4>
            <ul className="flex flex-1 flex-col gap-1 py-3 h-[280px] scroll-auto overflow-auto">
              {nationalities?.sort().map((nat) => (
                <li
                  key={nat}
                  className="px-6 relative flex flex-wrap items-center"
                >
                  <input
                    defaultChecked={isFilter(
                      searchParams.get("filters"),
                      nat,
                      "nationalities"
                    )}
                    className="w-4 h-4 transition-colors bg-white border-2 rounded appearance-none cursor-pointer focus-visible:outline-none peer border-slate-500 checked:border-emerald-500 checked:bg-emerald-500 checked:hover:border-emerald-600 checked:hover:bg-emerald-600 focus:outline-none checked:focus:border-emerald-700 checked:focus:bg-emerald-700 disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-50"
                    type="checkbox"
                    id={nat}
                    onChange={() => handleUpdateNationalites(nat)}
                  />
                  <label
                    className="pl-2 cursor-pointer text-slate-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400"
                    htmlFor={nat}
                  >
                    {nat}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </aside>

      <div
        className={`fixed top-0 bottom-0 left-0 right-0 z-30 bg-slate-900/20 transition-colors sm:hidden ${
          isSideNavOpen ? "block" : "hidden"
        }`}
        onClick={() => setIsSideNavOpen(false)}
      ></div>
      {/*  <!-- End Side navigation menu with content separator --> */}
    </>
  );
}
