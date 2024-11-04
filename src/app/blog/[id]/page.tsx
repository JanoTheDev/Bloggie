"use client";

import { userAccount } from "@/atoms/userAccount";
import SideBar from "@/components/Navbar";
import SmallCardInfo from "@/components/SmallCardInfo";
import { AllUserData } from "@/data/AllUserData";
import { BlogData } from "@/data/BlogData";
import { useAtom } from "jotai";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import hljs from "highlight.js";
import "highlight.js/styles/default.css";


export default function OtherProfile() {
  const params = useParams();
  const blogID = params.id;

  const [userAcc, setUserAcc] = useAtom(userAccount);
  const [blogOwner, setBlogOwner] = useState<any>({});
  const [blogData, setBlogData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const post = BlogData.filter((d) => d.cardID === blogID);
    if (post.length > 0) {
      setBlogOwner(post[0].user);
      setBlogData(post[0].info);
    }
    setLoading(false);
  }, [blogID]);

  const createMarkup = (markdown: string): { __html: string } => {
    const rawHtml: any = marked(markdown);
    return { __html: DOMPurify.sanitize(rawHtml) };
  };

  return (
    <div>
      <SideBar>
        <div>
          {loading === false && blogOwner.user_id && blogData.data ? (
            <div className="ml-6 lg:ml-0">
              <div className="markdown-body" dangerouslySetInnerHTML={createMarkup(blogData.data)} />
            </div>
          ) : loading === false && !blogOwner.user_id ? (
            <p className="text-center font-bold text-2xl">Blog not found</p>
          ) : loading === true && !blogOwner.user_id ? (
            <p className="text-center font-bold text-2xl">Loading</p>
          ) : (
            <></>
          )}
        </div>
      </SideBar>
    </div>
  );
}
