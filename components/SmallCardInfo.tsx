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
import { atom, useAtom } from "jotai";
import { sidebarToggle } from "@/atoms/Navbar";

interface data {
  data: any;
}

export const searchBarFilter = atom<string>("");

export default function SmallCardInfo({ data }: data) {
  const [open, setOpen] = useAtom(sidebarToggle);
  const [filterQuery, setFilterQuery] = useAtom(searchBarFilter);


  function handleTags(text: any) {
    // Redirect to /results?sq=Text
    setFilterQuery(text)
    window.location.href = `/results?fq=${encodeURIComponent(text)}`;
  };
  return (
    <a
      href={`/${data.cardID}`}
      className={`max-w-sm rounded overflow-hidden shadow-md bg-gray-200 w-[350px] ${
        open === false ? "lg:w-[350px]" : "lg:w-[320px]"
      }  cursor-pointer`}
    >
      <img
        className="w-full"
        src="https://cdn.discordapp.com/attachments/1038339416843886612/1089146769541173359/PlaceHolderIMG.jpg"
        alt="Image Description"
      />

      <div className="px-6 py-4">
        <div className="flex space-x-2 m-3 -ml-2 -mt-1">
          {data.info.tags ? (
            data.info.tags.slice(0, 3).map((tag: any, index: number) => (
              <a
                key={index}
                className="bg-gray-100 px-2 py-1 rounded-lg text-xs"
                onClick={() => handleTags(tag)}
                href={`/results?fq=${tag}`}
              >
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </a>
            ))
          ) : (
            <></>
          )}
          {data.info.tags ? (
            data.info.tags.length > 3 && (
              <div className="bg-gray-100 px-2 py-1 rounded-lg text-xs">
                +{data.info.tags.length - 3}
              </div>
            )
          ) : (
            <></>
          )}
        </div>
        <a href={`/profile/${data.user.user_id}`} className="flex">
          <div className="flex space-x-2">
            <img
              src={data.user.profile_picture}
              alt="pfp"
              className="w-8 h-8 rounded-full"
            />

            <p className="font-semibold text-lg text-gray-600 relative">
              <div className="relative group">{data.user.username}</div>
            </p>

            <div className="pt-1 relative">
              {data.user.verified === true ? (
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
          </div>
        </a>
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
              {data.info.views_count.length}
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
              {data.info.like_count.length}
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
            {data.info.copy_count.length}
          </button>
        </div>
      </div>
    </a>
  );
}
