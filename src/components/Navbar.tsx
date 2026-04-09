"use client";

import React, { Suspense, useEffect, useState, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { SidebarItem, SidebarItems } from "@/data/SidebarItems";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { searchBarText, sidebarToggle } from "@/atoms/Navbar";
import { themeAtom } from "@/atoms/theme";
import Link from "next/link";
import Image from "next/image";
import { IconMenu, IconSearch, IconSun, IconMoon } from "@/components/Icons";
import NotificationBell from "@/components/NotificationBell";
import SearchAutocomplete from "@/components/SearchAutocomplete";
import { debounce } from "@/lib/utils";
import { useUser, useProfile } from "@/lib/supabase/hooks";
import { createClient } from "@/lib/supabase/client";

function SideBarInner({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [sideItems, setSideItems] = useState<SidebarItem[]>(SidebarItems);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useAtom(sidebarToggle);
  const [searchQuery, setSearchQuery] = useAtom(searchBarText);
  const [theme, setTheme] = useAtom(themeAtom);
  const { user } = useUser();
  const { profile } = useProfile(user?.id);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const listParam = (searchParams.get("list") || "").toLowerCase();
    const newPathName = `${pathname.toLowerCase()}${listParam}`;
    setSideItems(
      SidebarItems.map((item) => ({ ...item, selected: item.alias === newPathName }))
    );
  }, [searchParams, pathname, mounted]);

  const navigateSearch = React.useMemo(
    () => debounce((q: string) => router.push(`/results?sq=${encodeURIComponent(q)}`), 300),
    [router]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigateSearch(searchQuery);
  };

  if (!mounted) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-black">
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full bg-white dark:bg-neutral-950 border-r border-gray-200 dark:border-neutral-800 transition-all duration-300 ease-in-out flex flex-col ${open ? "w-56 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-16"}`}>
        <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-neutral-800 shrink-0">
          {open ? (
            <>
              <Link href="/" className="text-xl font-bold text-gray-900 dark:text-neutral-100 truncate flex-1">Bloggie</Link>
              <button onClick={() => setOpen(false)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors" aria-label="Close sidebar">
                <IconMenu />
              </button>
            </>
          ) : (
            <button onClick={() => setOpen(true)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors mx-auto" aria-label="Open sidebar">
              <IconMenu />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {sideItems.map((item, i) =>
            item.type === "Dividor" ? (
              <div key={i} className="my-2 mx-2 h-px bg-gray-200 dark:bg-neutral-900" />
            ) : (
              <a key={i} href={item.href || "#"} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 mb-0.5 transition-colors duration-150 text-sm font-medium ${item.selected ? "bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-neutral-100" : "text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-900 hover:text-gray-900 dark:hover:text-neutral-100"} ${!open ? "lg:justify-center lg:px-0" : ""}`}>
                <span className="shrink-0 [&>svg]:w-5 [&>svg]:h-5">{item.image}</span>
                {open && <span className="truncate">{item.name}</span>}
              </a>
            )
          )}
        </nav>

        {/* Sidebar bottom: user profile */}
        <div className="border-t border-gray-200 dark:border-neutral-800 p-2 shrink-0">
          {user ? (
            <Menu as="div" className="relative">
              <Menu.Button className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors ${!open ? "lg:justify-center lg:px-0" : ""}`}>
                {profile?.avatar_url ? (
                  <Image src={profile.avatar_url} alt="" width={32} height={32} className="w-8 h-8 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-neutral-400 shrink-0">
                    {(profile?.username || user.email || "?")[0].toUpperCase()}
                  </div>
                )}
                {open && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-neutral-100 truncate">{profile?.username || "User"}</p>
                    <p className="text-xs text-gray-500 dark:text-neutral-500 truncate">{user.email}</p>
                  </div>
                )}
              </Menu.Button>
              <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Menu.Items className={`absolute ${open ? "left-0" : "left-full ml-2"} bottom-full mb-2 w-56 rounded-lg bg-white dark:bg-neutral-900 shadow-lg ring-1 ring-gray-200 dark:ring-neutral-800 py-1 focus:outline-none z-50`}>
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-neutral-800">
                    <p className="text-sm font-medium text-gray-900 dark:text-neutral-100">{profile?.username || "User"}</p>
                    <p className="text-xs text-gray-500 dark:text-neutral-500 truncate">{user.email}</p>
                  </div>
                  <Menu.Item>{({ active }) => <Link href="/profile" className={`block px-4 py-2 text-sm ${active ? "bg-gray-50 dark:bg-neutral-800" : ""} text-gray-700 dark:text-neutral-200`}>Your Profile</Link>}</Menu.Item>
                  <Menu.Item>{({ active }) => <Link href="/settings" className={`block px-4 py-2 text-sm ${active ? "bg-gray-50 dark:bg-neutral-800" : ""} text-gray-700 dark:text-neutral-200`}>Settings</Link>}</Menu.Item>
                  <Menu.Item>{({ active }) => (
                    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className={`flex items-center gap-2 w-full px-4 py-2 text-sm ${active ? "bg-gray-50 dark:bg-neutral-800" : ""} text-gray-700 dark:text-neutral-200`}>
                      {theme === "dark" ? <IconSun className="w-4 h-4" /> : <IconMoon className="w-4 h-4" />}
                      {theme === "dark" ? "Light mode" : "Dark mode"}
                    </button>
                  )}</Menu.Item>
                  <div className="my-1 h-px bg-gray-100 dark:bg-neutral-800" />
                  <Menu.Item>{({ active }) => (
                    <button onClick={async () => { const sb = createClient(); await sb.auth.signOut(); router.push("/login"); }} className={`block w-full text-left px-4 py-2 text-sm ${active ? "bg-gray-50 dark:bg-neutral-800" : ""} text-red-600 dark:text-red-400`}>
                      Sign out
                    </button>
                  )}</Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            <Link href="/login" className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-900 hover:text-gray-900 dark:hover:text-neutral-100 transition-colors ${!open ? "lg:justify-center lg:px-0" : ""}`}>
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg>
              </div>
              {open && <span>Sign in</span>}
            </Link>
          )}
        </div>
      </aside>

      {/* Main area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${open ? "lg:ml-56" : "lg:ml-16"}`}>
        <header className="sticky top-0 z-30 flex items-center h-14 px-4 bg-white dark:bg-neutral-950 border-b border-gray-200 dark:border-neutral-800 gap-3 shrink-0">
          <button onClick={() => setOpen(!open)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors lg:hidden" aria-label="Toggle sidebar">
            <IconMenu />
          </button>
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-neutral-100 lg:hidden">Bloggie</Link>

          <Suspense>
            <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto hidden sm:block">
              <SearchAutocomplete value={searchQuery} onChange={setSearchQuery} onSubmit={() => { if (searchQuery.trim()) navigateSearch(searchQuery); }} />
            </form>
          </Suspense>

          <div className="flex items-center gap-1 ml-auto">
            <NotificationBell />
          </div>
        </header>

        {/* Mobile search */}
        <Suspense>
          <div className="sm:hidden px-4 py-2.5 bg-white dark:bg-neutral-950 border-b border-gray-200 dark:border-neutral-800">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-neutral-500" />
                <input type="search" className="w-full pl-10 pr-4 py-2 text-sm bg-transparent border-0 text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </form>
          </div>
        </Suspense>

        <main id="main-content" className="flex-1 overflow-y-auto p-4 sm:p-6">
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
