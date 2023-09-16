import SideBar from "@/components/Navbar";
import SmallCardInfo from "@/components/SmallCardInfo";
import UserCardInfo from "@/components/UserCardInfo";
import { AllUserData } from "@/data/AllUserData";
import { BlogData } from "@/data/BlogData";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);
  const [randomData, setRandomData] = useState<any[]>([]);

  useEffect(() => {
    const randomizedData = [];

    // Shuffle the BlogData array randomly
    const shuffledBlogData = [...BlogData].sort(() => Math.random() - 0.5);

    // Shuffle the AllUserData array randomly
    const shuffledUserData = [...AllUserData].sort(() => Math.random() - 0.5);

    // Loop to generate the pattern
    for (let i = 0; i < 5; i++) {
      // Slice the first 5 items from the shuffled arrays
      const blogSlice = shuffledBlogData.slice(i * 5, (i + 1) * 5);
      const userSlice = shuffledUserData.slice(i * 1, (i + 1) * 1);

      // Push the sliced blog and user data
      randomizedData.push(...blogSlice, ...userSlice);
    }

    console.log(randomizedData);
    setRandomData(randomizedData);
    setLoading(false);
  }, []);

  return (
    <div>
      {loading === true ? (
        <></>
      ) : (
        <SideBar>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {randomData.map((x: any, i: number) => (
              <React.Fragment key={i}>
                <div
                  className="items-center justify-center flex pt-6 lg:pt-0 lg:justify-start lg:items-start pb-6"
                >
                  <div className="flex flex-wrap justify-center lg:justify-start lg:pl-3">
                    {x.cardID && <SmallCardInfo data={x} />}
                  </div>
                </div>
                {!x.cardID && (
                  <div className="w-full pt-6 pb-6 lg:pt-0 ">
                    <UserCardInfo data={x} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </SideBar>
      )}
    </div>
  );
}

