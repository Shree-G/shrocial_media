import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/ModeToggle";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="m-2 flex gap-4">
      <SignedOut>
        <SignInButton mode="modal"> 
          <Button>
            Sign In
          </Button>
        </SignInButton>

        <SignUpButton mode="modal"> 
          <Button>
            Sign Up
          </Button>
        </SignUpButton>
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>

      <ModeToggle />

    </div>
  );
}
