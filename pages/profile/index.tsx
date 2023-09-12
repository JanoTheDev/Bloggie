import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

export default function Home() {
  return (
    <div>
      <Navbar
        children={
          <div>
            <p>This is the profile tab</p>
          </div>
        }
      />
    </div>
  );
}
