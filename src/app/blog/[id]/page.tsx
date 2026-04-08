"use client";

import { userAccount } from "@/atoms/userAccount";
import SideBar from "@/components/Navbar";
import UserCardInfo from "@/components/UserCardInfo";
import { BlogData } from "@/data/BlogData";
import { useAtom } from "jotai";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import hljs from "highlight.js";
import "highlight.js/styles/default.css";

export default function BlogPost() {
  const params = useParams();
  const blogID = params.id;

  const [userAcc] = useAtom(userAccount);
  const [blogOwner, setBlogOwner] = useState<any>({});
  const [blogData, setBlogData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const post = BlogData.filter((d) => d.cardID === blogID);
    if (post.length > 0) {
      setBlogOwner(post[0].user);
      setBlogData(post[0].info);
    }
    setLoading(false);
  }, [blogID]);

  const createMarkup = (markdown: string): { __html: string } => {
    const rawHtml = marked.parse(markdown, { async: false }) as string;
    return { __html: DOMPurify.sanitize(rawHtml) };
  };

  if (loading) return <SideBar><p className="text-center text-gray-500 py-12">Loading...</p></SideBar>;
  if (!blogOwner.user_id) return <SideBar><p className="text-center text-gray-500 py-12">Blog not found</p></SideBar>;

  return (
    <SideBar>
      <div className="max-w-3xl">
        <UserCardInfo data={blogOwner} />
        <hr className="my-6 border-gray-200" />
        <div
          className="markdown-body prose prose-gray max-w-none"
          dangerouslySetInnerHTML={createMarkup(blogData.data)}
        />
      </div>
    </SideBar>
  );
}
