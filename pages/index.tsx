import { userAccount } from "@/atoms/userAccount";
import SideBar from "@/components/Navbar";
import SmallCardInfo from "@/components/SmallCardInfo";
import UserCardInfo from "@/components/UserCardInfo";
import { AllUserData } from "@/data/AllUserData";
import { BlogData } from "@/data/BlogData";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);
  const [randomData, setRandomData] = useState<any[]>([]);
  const [userAcc, setUserAcc] = useAtom(userAccount);

  useEffect(() => {
    const randomizedData = [];
    
    // Shuffle the BlogData array randomly
    const shuffledBlogData = [...BlogData].sort(() => Math.random() - 0.5);
    
    // Shuffle the AllUserData array randomly
    const shuffledUserData = [...AllUserData].sort(() => Math.random() - 0.5);
    
    // Get the IDs of users that the current user follows
    const followedUserIds = userAcc.user_id
      ? AllUserData.find((user) => user.user_id === userAcc.user_id)
          ?.followers || []
      : [];
    
    let blogIndex = 0;
    
    // Loop to generate the pattern
    for (let i = 0; i < 5; i++) {
      // Push 5 blog posts
      const blogSlice = shuffledBlogData.slice(blogIndex, blogIndex + 5);
      randomizedData.push(...blogSlice);
      blogIndex += 5;
      
      // Push a user if there are more users
      if (i < 4) {
        const userSlice = shuffledUserData.slice(i, i + 1);
        randomizedData.push(...userSlice);
      }
    }
    
    setRandomData(randomizedData);
    setLoading(false);
  }, [userAcc.user_id]);



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
                <div className="items-center justify-center flex pt-6 lg:pt-0 lg:justify-start lg:items-start pb-6">
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
