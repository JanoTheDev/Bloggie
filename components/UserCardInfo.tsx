import { atom, useAtom } from "jotai";
import { sidebarToggle } from "@/atoms/Navbar";
import React, { Fragment, useEffect, useMemo, useState } from "react";

interface props {
    data: any
}

export default function UserCardInfo({ data }: props) {
    return (
        <div className="flex flex-col space-y-6 lg:space-y-0 lg:flex-none lg:grid lg:grid-cols-2">
              <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start">
                <img
                  src={data.profile_picture}
                  alt=""
                  className="flex w-32 h-32"
                />
                <div className="flex flex-col items-center lg:items-start justify-center">
                  <div className="flex items-center">
                    <p className="text-2xl font-bold mr-2">
                      {data.username}
                    </p>
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
                  </div>

                  <p className="text-lg font-semibold text-gray-600">
                    {data.followers.length} followers
                  </p>
                  <p className="text-sm font-semibold text-black">
                    {data.user_description}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center lg:justify-end lg:mr-12">
                <button className="text-white bg-gray-600 text-lg rounded-lg px-4 py-2 ">
                  Follow
                </button>
              </div>
            </div>
    )
}