"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { SidebarItem, SidebarItems } from "@/data/SidebarItems";
import { useSearchParams, usePathname } from "next/navigation";
import { Fragment } from "react";
import { useAtom } from "jotai";
import { searchBarText, sidebarToggle } from "@/atoms/Navbar";
import { userAccount } from "@/atoms/userAccount";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
}

export default function SideBar({ children }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [sideItems, setSideItems] = useState<SidebarItem[]>(SidebarItems);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useAtom(sidebarToggle);
  const [searchQuery, setSearchQuery] = useAtom(searchBarText);
  const [userAcc] = useAtom(userAccount);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const listParam = (searchParams.get("list") || "").toLowerCase();
    const newPathName = `${pathname.toLowerCase()}${listParam}`;
    setSideItems(
      SidebarItems.map((item) => ({
        ...item,
        selected: item.alias === newPathName,
      }))
    );
  }, [searchParams, pathname, mounted]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/results?sq=${encodeURIComponent(searchQuery)}`;
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200
          transition-all duration-300 ease-in-out flex flex-col
          ${open ? "w-56 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-16"}
        `}
      >
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200 shrink-0">
          {open ? (
            <Link href="/" className="text-xl font-bold text-gray-900 truncate">
              Bloggie
            </Link>
          ) : (
            <button
              onClick={() => setOpen(true)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          )}
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {sideItems.map((item, i) =>
            item.type === "Dividor" ? (
              <div key={i} className="my-2 mx-2 h-px bg-gray-200" />
            ) : (
              <a
                key={i}
                href={item.href || "#"}
                className={`
                  flex items-center gap-3 rounded-lg px-3 py-2.5 mb-0.5
                  transition-colors duration-150 text-sm font-medium
                  ${item.selected
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
                  ${!open ? "lg:justify-center lg:px-0" : ""}
                `}
              >
                <span className="shrink-0 [&>svg]:w-5 [&>svg]:h-5">{item.image}</span>
                {open && <span className="truncate">{item.name}</span>}
              </a>
            )
          )}
        </nav>
      </aside>

      {/* Main area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${open ? "lg:ml-56" : "lg:ml-16"}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center h-16 px-4 bg-white border-b border-gray-200 gap-4 shrink-0">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <Link href="/" className="text-xl font-bold text-gray-900 lg:hidden">
            Bloggie
          </Link>

          <Suspense>
            <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-auto hidden sm:block">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
                <input
                  type="search"
                  className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                  placeholder="Search posts, users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </Suspense>

          <Menu as="div" className="relative ml-auto">
            <Menu.Button className="rounded-full ring-2 ring-gray-200 hover:ring-gray-300 transition-all">
              <img
                src={userAcc.profile_picture}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover"
              />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-gray-200 py-1 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/profile"
                      className={`block px-4 py-2 text-sm ${active ? "bg-gray-50" : ""} text-gray-700`}
                    >
                      Your Profile
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`block w-full text-left px-4 py-2 text-sm ${active ? "bg-gray-50" : ""} text-gray-700`}
                    >
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </header>

        {/* Mobile search */}
        <Suspense>
          <div className="sm:hidden px-4 py-3 bg-white border-b border-gray-200">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
                <input
                  type="search"
                  className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>
        </Suspense>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
