import { BellIcon, Ghost, HomeIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";
import ModeToggle from "./ModeToggle";
import { currentUser } from "@clerk/nextjs/server";

async function DesktopNavbar() {
  const user = await currentUser();

  return (
    <div className="hidden md:flex items-center justify-center gap-3">
        <ModeToggle />

        <Button variant="ghost" className="flex items-center justify-center" asChild>
            <Link href="/">
                <HomeIcon />
                <span className="hidden lg:inline">Home</span>
            </Link>
        </Button>

        { user ? (
            <div className="hidden md:flex items-center justify-center gap-3">
                <Button variant="ghost" className="flex items-center justify-center" asChild>
                    <Link href="/notifications">
                        <BellIcon />
                        <span className="hidden lg:inline">Notifications</span>
                    </Link>
                </Button>

                <Button variant="ghost" className="flex items-center justify-center" asChild>
                    <Link href = {`/${user.username ?? user.emailAddresses[0].emailAddress.split("@")[0]}`}>
                        <UserIcon />
                        <span className="hidden lg:inline">Profile</span>
                    </Link>
                </Button>

                <UserButton />
            </div>
            


            ) :

            (
                <SignInButton mode="modal">
                    <Button variant="default">
                        Sign In
                    </Button>
                </SignInButton>
            )
        }

        

    </div>

  );
}
export default DesktopNavbar;