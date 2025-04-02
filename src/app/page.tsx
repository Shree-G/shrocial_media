import { getAllRelevantPosts } from "@/actions/post.action";
import CreatePost from "@/components/CreatePost";
import RecUsers from "@/components/RecUsers";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  const posts = await getAllRelevantPosts();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-6">

        {user ? <CreatePost /> : null}

        {posts.map((post) => (
          // <PostCard id=post.id />
          <p id={post.id}>{post.content}</p>
        ))}

      </div>

      <div className="hidden lg:block lg:col-span-4 sticky top-20">
        <RecUsers />
      </div>
    </div>
  );
}
