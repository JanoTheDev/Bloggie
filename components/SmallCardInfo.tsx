import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  Disclosure,
  Menu,
  Transition,
  Dialog,
  Listbox,
} from "@headlessui/react";
import { SidebarItems } from "@/data/SidebarItems";

interface data {
  data: any;
}

export default function SmallCardInfo({ data }: data) {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-md bg-gray-200 w-[350px]">
      <img
        className="w-full"
        src="https://cdn.discordapp.com/attachments/1038339416843886612/1089146769541173359/PlaceHolderIMG.jpg"
        alt="Image Description"
      />

      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{data.info.name}</div>
        <p className="text-gray-700 text-base">{data.info.shortDescription}</p>
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center justify-start space-x-3 mt-2">
            <span className="text-gray-600 text-sm flex items-center justify-center gap-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6 inline"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>{" "}
              {data.info.views_count}
            </span>
            <span className="text-gray-600 text-sm flex items-center justify-center gap-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6 inline"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.230l-3.114-1.04a4.501 4.501 0 00-1.423-.230H5.904"
                />
              </svg>{" "}
              {data.info.like_count}
            </span>
          </div>

          <button className="text-gray-600 text-sm flex items-center justify-center gap-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6 inline"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
              />
            </svg>
            {data.info.copy_count}
          </button>
        </div>
      </div>
    </div>
  );
}
