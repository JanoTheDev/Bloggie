"use client";

import React, { Suspense, useEffect, useState, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { SidebarItem, SidebarItems } from "@/data/SidebarItems";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { searchBarText, sidebarToggle } from "@/atoms/Navbar";
import { userAccount } from "@/atoms/userAccount";
import { themeAtom } from "@/atoms/theme";
import Link from "next/link";
import Image from "next/image";
import { IconMenu, IconSearch, IconSun, IconMoon } from "@/components/Icons";

function SideBarInner({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [sideItems, setSideItems] = useState<SidebarItem[]>(SidebarItems);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useAtom(sidebarToggle);
  const [searchQuery, setSearchQuery] = useAtom(searchBarText);
  const [userAcc] = useAtom(userAccount);
  const [theme, setTheme] = useAtom(themeAtom);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const listParam = (searchParams.get("list") || "").toLowerCase();
    const newPathName = `${pathname.toLowerCase()}${listParam}`;
    setSideItems(
      SidebarItems.map((item) => ({ ...item, selected: item.alias === newPathName }))
    );
  }, [searchParams, pathname, mounted]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/results?sq=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-black">
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 z-50 h-full bg-white dark:bg-neutral-950 border-r border-gray-200 dark:border-neutral-800 transition-all duration-300 ease-in-out flex flex-col ${open ? "w-56 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-16"}`}>
        <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-neutral-800 shrink-0">
          {open ? (
            <>
              <Link href="/" className="text-xl font-bold text-gray-900 dark:text-neutral-100 truncate flex-1">Bloggie</Link>
              <button onClick={() => setOpen(false)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors">
                <IconMenu />
              </button>
            </>
          ) : (
            <button onClick={() => setOpen(true)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors mx-auto">
              <IconMenu />
            </button>
          )}
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {sideItems.map((item, i) =>
            item.type === "Dividor" ? (
              <div key={i} className="my-2 mx-2 h-px bg-gray-200 dark:bg-neutral-900" />
            ) : (
              <a key={i} href={item.href || "#"} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 mb-0.5 transition-colors duration-150 text-sm font-medium ${item.selected ? "bg-gray-900 dark:bg-neutral-800 text-white dark:text-neutral-100" : "text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-900 hover:text-gray-900 dark:hover:text-neutral-100"} ${!open ? "lg:justify-center lg:px-0" : ""}`}>
                <span className="shrink-0 [&>svg]:w-5 [&>svg]:h-5">{item.image}</span>
                {open && <span className="truncate">{item.name}</span>}
              </a>
            )
          )}
        </nav>
      </aside>

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${open ? "lg:ml-56" : "lg:ml-16"}`}>
        <header className="sticky top-0 z-30 flex items-center h-16 px-4 bg-white dark:bg-neutral-950 border-b border-gray-200 dark:border-neutral-800 gap-4 shrink-0">
          <button onClick={() => setOpen(!open)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors lg:hidden">
            <IconMenu />
          </button>
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-neutral-100 lg:hidden">Bloggie</Link>

          <Suspense>
            <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-auto hidden sm:block">
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="search"
                  className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-700 text-gray-900 dark:text-neutral-100 placeholder-gray-400"
                  placeholder="Search posts, users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </Suspense>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <IconSun /> : <IconMoon />}
            </button>

            <Menu as="div" className="relative">
              <Menu.Button className="rounded-full ring-2 ring-gray-200 dark:ring-neutral-800 hover:ring-gray-300 dark:hover:ring-neutral-700 transition-all">
                <Image src={userAcc.profile_picture} alt="Profile" width={32} height={32} className="rounded-full object-cover" />
              </Menu.Button>
              <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 rounded-lg bg-white dark:bg-neutral-900 shadow-lg ring-1 ring-gray-200 dark:ring-neutral-800 py-1 focus:outline-none">
                  <Menu.Item>{({ active }) => <Link href="/profile" className={`block px-4 py-2 text-sm ${active ? "bg-gray-50 dark:bg-neutral-800" : ""} text-gray-700 dark:text-neutral-200`}>Your Profile</Link>}</Menu.Item>
                  <Menu.Item>{({ active }) => <button className={`block w-full text-left px-4 py-2 text-sm ${active ? "bg-gray-50 dark:bg-neutral-800" : ""} text-gray-700 dark:text-neutral-200`}>Sign out</button>}</Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </header>

        <Suspense>
          <div className="sm:hidden px-4 py-3 bg-white dark:bg-neutral-950 border-b border-gray-200 dark:border-neutral-800">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="search" className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-700 text-gray-900 dark:text-neutral-100 placeholder-gray-400" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </form>
          </div>
        </Suspense>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function SideBar({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <SideBarInner>{children}</SideBarInner>
    </Suspense>
  );
}
