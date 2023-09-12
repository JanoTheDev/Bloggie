import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

export default function Home() {
  return (
    <div>
      <Navbar
        children={
          <div>
            <p>Hello this is the playlist tab</p>
          </div>
        }
      />
    </div>
  );
}
