import { useRouter } from "next/router";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { BlogData } from "@/data/BlogData";
import SideBar from "@/components/Navbar";
import SmallCardInfo, { searchBarFilter } from "@/components/SmallCardInfo";
import { useAtom } from "jotai";
import { searchBarText, sidebarToggle } from "@/atoms/Navbar";
import { AllUserData } from "@/data/AllUserData";
import UserCardInfo from "@/components/UserCardInfo";

export default function ResultsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useAtom(searchBarText);
  const [filterQuery, setFilterQuery] = useAtom(searchBarFilter);
  const [open, setOpen] = useAtom(sidebarToggle);

  useEffect(() => {
    let SearchQuery = router.query.sq;
    let FilterQuery = router.query.fq;
    if (!SearchQuery) {
      SearchQuery = "";
    }
    if (!FilterQuery) {
      FilterQuery = "";
    }
    setLoading(false);

    if (SearchQuery && !FilterQuery) {
      const filteredData = BlogData.filter((item) => {
        const user = item.user;
        const info = item.info;

        return (
          user.username
            .toLowerCase()
            .includes(SearchQuery?.toString().toLowerCase() as string) ||
          user.work_place
            .toLowerCase()
            .includes(SearchQuery?.toString().toLowerCase() as string) ||
          user.location
            .toLowerCase()
            .includes(SearchQuery?.toString().toLowerCase() as string) ||
          info.name
            .toLowerCase()
            .includes(SearchQuery?.toString().toLowerCase() as string) ||
          info.tags.includes(FilterQuery?.toString().toLowerCase() as string)
        );
      });

      const filteredUsers = AllUserData.filter((user) => {
        return (
          user.user_id
            .toLowerCase()
            .includes(SearchQuery?.toString().toLowerCase() as string) ||
          user.username
            .toLowerCase()
            .includes(SearchQuery?.toString().toLowerCase() as string) ||
          user.work_place
            .toLowerCase()
            .includes(SearchQuery?.toString().toLowerCase() as string) ||
          user.location
            .toLowerCase()
            .includes(SearchQuery?.toString().toLowerCase() as string)
        );
      });

      setItems(filteredData);
      setUsers(filteredUsers);
      setSearchQuery(SearchQuery?.toString());
      setFilterQuery(FilterQuery?.toString());
    } else if (SearchQuery && FilterQuery) {
      const filteredData = BlogData.filter((item) => {
        const user = item.user;
        const info = item.info;

        return (
          info.tags.includes(FilterQuery?.toString().toLowerCase() as string) &&
          (user.username
            .toLowerCase()
            .includes(SearchQuery?.toString().toLowerCase() as string) ||
            user.work_place
              .toLowerCase()
              .includes(SearchQuery?.toString().toLowerCase() as string) ||
            user.location
              .toLowerCase()
              .includes(SearchQuery?.toString().toLowerCase() as string) ||
            info.name
              .toLowerCase()
              .includes(SearchQuery?.toString().toLowerCase() as string))
        );
      });

      const filteredUsers = AllUserData.filter((user) => {
        return (
          user.user_id
            .toLowerCase()
            .includes(SearchQuery?.toString().toLowerCase() as string) ||
          user.username
            .toLowerCase()
            .includes(SearchQuery?.toString().toLowerCase() as string) ||
          user.work_place
            .toLowerCase()
            .includes(SearchQuery?.toString().toLowerCase() as string) ||
          user.location
            .toLowerCase()
            .includes(SearchQuery?.toString().toLowerCase() as string)
        );
      });

      setItems(filteredData);
      setUsers(filteredUsers);
      setSearchQuery(SearchQuery?.toString());
      setFilterQuery(FilterQuery?.toString());
    } else if (FilterQuery && !SearchQuery) {
      const filteredData = BlogData.filter((item) => {
        const user = item.user;
        const info = item.info;
        return info.tags.includes(
          FilterQuery?.toString().toLowerCase() as string
        );
      });

      setItems(filteredData);
      setSearchQuery(SearchQuery?.toString());
      setFilterQuery(FilterQuery?.toString());
    }
  }, [router.query]);

  return (
    <div>
      {loading === true ? (
        <></>
      ) : (
        <div>
          <SideBar>
            {users.length > 0 ? (
              <div>
                {users.map((x: any, i: number) => (
                  <UserCardInfo data={x} key={i} />
                ))}
              </div>
            ) : (
              <></>
            )}
            {items.length > 0 ? (
              <div className="items-center justify-center flex pt-6 lg:pt-0 lg:justify-start lg:items-start pb-24">
                <div className="flex flex-wrap justify-center gap-3">
                  {items.map((x: any, i: number) => (
                    <SmallCardInfo key={i} data={x} />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-4xl flex items-center justify-center">
                No items found
              </p>
            )}
          </SideBar>
        </div>
      )}
    </div>
  );
}
