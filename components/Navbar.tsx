import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  Disclosure,
  Menu,
  Transition,
  Dialog,
  Listbox,
} from "@headlessui/react";
import { SidebarItem, SidebarItems } from "@/data/SidebarItems";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

interface props {
  children: any;
}
export default function SideBar({ children }: props) {
  const router = useRouter();
  const [sideItems, setSideItems] = useState<any>(SidebarItems);

  useEffect(() => {
    console.log("Hi");
    let someQueryParam = router.query.list;
    console.log(someQueryParam);
    let queryParamValue = "";
    if (!someQueryParam) someQueryParam = "";
    console.log(someQueryParam);

    // Check if someQueryParam is an array or a string
    if (Array.isArray(someQueryParam)) {
      // Handle if it's an array (e.g., someQueryParam=['value1', 'value2'])
      queryParamValue = someQueryParam.join("").toLowerCase();
    } else {
      // Handle if it's a string (e.g., someQueryParam='value')
      queryParamValue = someQueryParam.toLowerCase();
    }

    const newPathName = `${router.pathname.toLowerCase()}${queryParamValue}`;

    // Update the items array with the selected value
    const updatedItems = SidebarItems.map((item) => {
      return {
        ...item,
        selected: item.alias === newPathName,
      };
    });

    setSideItems(updatedItems); // Update the state with the new items
  }, [router.query, router.pathname]);

  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => {
    setOpen(!open);
  };
  return (
    <div>
      <div className="flex m-4 z-[999] w-full mb-4">
        <div className="flex items-start justify-start space-x-6 w-[10%]">
          <button onClick={handleOpen}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          <p className="text-3xl font-bold lg:block hidden">Bloggie</p>
        </div>
        <div className="flex items-start justify-center w-[70%]">
          <form>
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full sm:w-96 p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 "
                placeholder="Search..."
                required
              />
              <button
                type="submit"
                className="text-gray-700 absolute right-2.5 bottom-2.5 bg-gray-300 hover:bg-gray-400 font-medium rounded-lg text-sm px-4 py-[4px]"
              >
                Search
              </button>
            </div>
          </form>
        </div>
        <Menu as="div" className="relative inline-block text-left w-[17%]">
          <div className="flex items-end justify-end">
            <Menu.Button className="flex justify-end rounded-full bg-[#090410] text-sm">
              <span className="sr-only">Open user menu</span>
              <div className="h-10 w-10 rounded-full" />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-[#090410] py-1 shadow-lg ring-1 ring-[#090410] ring-opacity-5 focus:outline-none">
              <a
                href="#"
                className="block px-4 py-2 text-sm cursor-pointer text-white"
              >
                Sign out
              </a>
            </div>
          </Transition>
        </Menu>
      </div>

      <div className="flex flex-row">
        <div
          className={`lg:m-4 w-auto lg:bottom-0 lg:sticky lg:border-r lg:border-gray-400 h-screen z-[999] bg-white lg:bg-transparent
          absolute top-20 `}
        >
          <div className="max-h-[100%] overflow-y-auto">
            {open === true ? (
              <div className={`flex flex-col space-y-3 lg:pr-4 w-[200px]`}>
                {sideItems.map((x: SidebarItem, i: number) => (
                  <a href={x.href} key={i}>
                    {x.type === "Item" ? (
                      <div
                        className={`flex ${
                          x.selected === true
                            ? "bg-gray-200 rounded-xl px-2 py-2"
                            : " pl-2"
                        } `}
                        key={i}
                      >
                        <div className="flex items-start justify-center pr-12">
                          {x.image}
                        </div>
                        <p className="flex items-end justify-center font-semibold">
                          {x.name}
                        </p>
                      </div>
                    ) : (
                      <div
                        className="mt-3 mb-3 bg-gray-400 h-[0.5px]"
                        key={i}
                      ></div>
                    )}
                  </a>
                ))}
              </div>
            ) : (
              <div className="lg:pr-4 hidden lg:block">
                <div className="flex flex-col space-y-3">
                  {sideItems.map((x: SidebarItem, i: number) => (
                    <a href={x.href} key={i}>
                      {x.type === "Item" ? (
                        <div
                          className={`${
                            x.selected === true
                              ? "bg-gray-200 rounded-xl px-2 py-2"
                              : "pl-2"
                          } `}
                          key={i}
                        >
                          {x.image}
                        </div>
                      ) : (
                        <div
                          className="mt-3 mb-3 bg-gray-400 h-[0.5px]"
                          key={i}
                        ></div>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="pt-12 w-full h-full overflow-hidden">
          <div className="overflow-auto max-h-[calc(140vh-20rem)] lg:max-h-[calc(120vh-20rem)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
