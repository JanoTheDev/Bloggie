import type { SidebarItem } from "@/types";
import { IconHome, IconProfile, IconFollowing, IconHistory, IconReadLater, IconLikedBlogs, IconPlus } from "@/components/Icons";

export type { SidebarItem };

export const SidebarItems: SidebarItem[] = [
  { type: "Item", alias: "/", selected: false, href: "/", name: "Home", image: <IconHome /> },
  { type: "Item", alias: "/profile", selected: false, href: "/profile", name: "Profile", image: <IconProfile /> },
  { type: "Item", alias: "/following", selected: false, href: "/following", name: "Following", image: <IconFollowing /> },
  { type: "Dividor" },
  { type: "Item", alias: "/playlistrh", selected: false, href: "/playlist?list=RH", name: "History", image: <IconHistory /> },
  { type: "Item", alias: "/playlistrl", selected: false, href: "/playlist?list=RL", name: "Read Later", image: <IconReadLater /> },
  { type: "Item", alias: "/playlistlb", selected: false, href: "/playlist?list=LB", name: "Liked Blogs", image: <IconLikedBlogs /> },
  { type: "Dividor" },
  { type: "Item", alias: "/create", selected: false, href: "/create", name: "New Post", image: <IconPlus /> },
];
