import { atom, useAtom } from "jotai";
import { sidebarToggle } from "@/atoms/Navbar";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { userAccount } from "@/atoms/userAccount";

interface props {
  data: any;
}

export default function UserCardInfo({ data }: props) {
  const [userAcc, setUserAcc] = useAtom(userAccount);
  return (
    <div className="flex flex-col space-y-6 lg:space-y-0 lg:flex-none lg:grid lg:grid-cols-2">
      <a href={`/profile/${data.user_id}`} className="flex flex-col lg:flex-row items-center justify-center lg:justify-start">
        <img src={data.profile_picture} alt="" className="flex w-32 h-32" />
        <div className="flex flex-col items-center lg:items-start justify-center">
          <div className="flex items-center">
            <p className="text-2xl font-bold mr-2">{data.username}</p>
            {data.verified === true ? (
              <div className="relative group">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                  />
                </svg>
                <div className="absolute bottom-6 rounded-lg left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                  Verified
                </div>
              </div>
            ) : (
              <></>
            )}

            <div className="flex flex-wrap gap-6 lg:pl-5">
              <div className="flex space-x-4 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                {data.location}
              </div>
              <div className="flex space-x-4 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                  />
                </svg>

                {data.work_place}
              </div>
            </div>
          </div>

          <p className="text-lg font-semibold text-gray-600">
            {data.followers.length} followers
          </p>
          <p className="text-sm font-semibold text-black">
            {data.user_description}
          </p>
        </div>
      </a>
      <div className="flex items-center justify-center lg:justify-end lg:mr-12">
        <button className="text-white bg-gray-600 text-lg rounded-lg px-4 py-2 ">
          {data.followers.includes(userAcc.user_id) ? "Following" : "Follow"}
        </button>
      </div>
    </div>
  );
}
