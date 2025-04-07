"use server"

import { prisma } from "@/lib/prisma";
import { getDbUserId, getUserByClerkId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function createPost(content: string, imageUrl: string) {
  const userId = await getDbUserId();
  if (!userId) return { success: false, error: "could not find this user" };

  try {
    const post = await prisma.post.create({
      data: {
        authorId: userId,
        content,
        image: imageUrl,
      }
    })

    revalidatePath("/");
    return { success: true, post }

  } catch (error) {
    console.error("Failed to create post:", error);
    return { success: false, error: "Failed to create post" };
  }

}

export async function getAllRelevantPosts() {
  const userId = await getDbUserId();
  if (!userId) return [];

  try {
    const followings = await prisma.follows.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followingIds = followings.map(f => f.followingId);

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { authorId: userId },
          {
            authorId: {
              // the post's author id is one of the user's followers
              in: followingIds
            }
          },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        author: true,
        comments: true,
        likes: true,
      },
    })

    return posts;
  } catch (e) {
    console.log("Error fetching posts", e)
    return [];
  }
}

export async function getAllPosts() {
  try {

    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                image: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: "asc",
          }
        },
        likes: {
          select: {
            userId: true,
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          }
        }
      },
    })

    return posts;
  } catch (e) {
    console.log("Error fetching posts", e)
    return [];
  }
}

export async function toggleLike(postId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;

    // check if like exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new Error("Post not found");

    if (existingLike) {
      // unlike
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    } else {
      // like and create notification (only if liking someone else's post)
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId,
            postId,
          },
        }),
        ...(post.authorId !== userId
          ? [
            prisma.notification.create({
              data: {
                type: "LIKE",
                notifReceiverId: post.authorId, // recipient (post author)
                notifCreatorId: userId, // person who liked
                postId,
              },
            }),
          ]
          : []),
      ]);
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle like:", error);
    return { success: false, error: "Failed to toggle like" };
  }
}

export async function createComment(postId: string, commentStr: string) {

  try {
    const userId = await getDbUserId();
    if (!userId) return;

    if (!commentStr) throw new Error("Content is required");


    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new Error("Post not found");

    const commentAdded = await prisma.$transaction(async (tx) => {
      const newComment = await tx.comment.create({
        data: {
          authorId: userId,
          postId: postId,
          content: commentStr,
        },
      });

      if (post.authorId !== userId) {
        await tx.notification.create({
          data: {
            type: "COMMENT",
            notifReceiverId: post.authorId, // recipient (post author)
            notifCreatorId: userId, // person who commented
            commentId: newComment.id,
            postId,
          },
        });
      }

      return newComment;
    });

    revalidatePath("/");
    return { success: true, comment: commentAdded };
  } catch (error) {
    console.error("Failed to create comment:", error);
    return { success: false, error: "Failed to create comment" };
  }

}

export async function deletePost(postId: string) {

  try {

    const userId = await getDbUserId();
    if (!userId) return { success: false, error: "No User Found" };

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) {
      throw new Error("Post that you are trying to delete does not exist")
    }

    if (post.authorId !== userId) {throw new Error("Unauthorized - no delete permission")}

    await prisma.post.delete({
      where: { id: postId },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log("Failed to delete post", postId, error)
    return { success: false, error: "Failed to delete post" }
  }


}