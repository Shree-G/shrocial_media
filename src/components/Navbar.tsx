import Link from "next/link";
import React from "react";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/actions/user.action";

export default async function Navbar() {
    const user = await currentUser();

    if(user) {
        await syncUser(); // POST request
    }


  return (
    <nav className="sticky top-0 z-50 w-full border-b">
      <div className="max-w-7xl flex items-center my-2 mx-auto px-3 justify-between">
        <Link href="/" className="font-mono tracking-wide text-xl">
          Shrocial Media
        </Link>

        <DesktopNavbar />
        <MobileNavbar />
      </div>
    </nav>
  );
}
