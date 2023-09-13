import SideBar from "@/components/Navbar";
import SmallCardInfo from "@/components/SmallCardInfo";
import { BlogData } from "@/data/BlogData";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <div>
      {loading === true ? (
        <></>
      ) : (
        <SideBar
          children={
            <div className="items-center justify-center flex pt-6 lg:pt-0 lg:justify-start lg:items-start pb-24">
              <div className="flex flex-wrap justify-center gap-3">
                {BlogData.map((x: any, i: number) => (
                  <SmallCardInfo data={x} />
                ))}
              </div>
            </div>
          }
        />
      )}
    </div>
  );
}
