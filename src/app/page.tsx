import CreatePost from "@/components/CreatePost";
import RecUsers from "@/components/RecUsers";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-7">
        {user ? <CreatePost /> : null}
      </div>

      <div className="hidden lg:block lg:col-span-3 sticky top-20">
        <RecUsers />
      </div>
    </div>
  );
}
