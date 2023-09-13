import { useRouter } from "next/router";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { BlogData } from "@/data/BlogData";
import SideBar from "@/components/Navbar";
import SmallCardInfo from "@/components/SmallCardInfo";

export default function ResultsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<any>(BlogData);
  useEffect(() => {
    let someQueryParam = router.query.sq;
    console.log(someQueryParam);
    if (!someQueryParam) setItems([]);
    setLoading(false);

    const filteredData = BlogData.filter((item) => {
      const user = item.user;
      const info = item.info;

      return (
        user.username.toLowerCase().includes(someQueryParam as string) ||
        user.work_place.toLowerCase().includes(someQueryParam as string) ||
        user.location.toLowerCase().includes(someQueryParam as string) ||
        info.name.toLowerCase().includes(someQueryParam as string)
      );
    });

    setItems(filteredData);
  }, [router.query]);

  return (
    <div>
      {loading === true ? (
        <></>
      ) : (
        <div>
          <SideBar>
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
