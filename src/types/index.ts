import type React from "react";

export interface UserSocials {
  github: string;
  twitter: string;
  youtube: string;
  instagram: string;
}

export interface User {
  username: string;
  verified: boolean;
  user_id: string;
  profile_picture: string;
  join_date: string;
  user_description: string;
  work_place: string;
  location: string;
  socials: UserSocials;
  skills: string[];
  history: string[];
  followers: string[];
  following: string[];
  profiles_opened: string[];
  read_later: string[];
  liked_blogs: string[];
}

export interface BlogUser {
  username: string;
  verified: boolean;
  user_id: string;
  followers: string[];
  profile_picture: string;
  join_date: string;
  user_description: string;
  work_place: string;
  location: string;
}

export interface BlogInfo {
  time_posted: string;
  image: string;
  name: string;
  shortDescription: string;
  read_later: string[];
  views_count: string[];
  like_count: string[];
  copy_count: string[];
  tags: string[];
  data: string;
}

export interface BlogPost {
  cardID: string;
  user: BlogUser;
  info: BlogInfo;
}

export interface SidebarItem {
  type: "Item" | "Dividor";
  alias?: string;
  selected?: boolean;
  href?: string;
  name?: string;
  image?: React.ReactNode;
}
