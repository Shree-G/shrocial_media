"use server"

import { prisma } from "@/lib/prisma";
import { getDbUserId, getUserByClerkId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function createPost(content:string, imageUrl:string) {
    const userId = await getDbUserId();
    if(!userId) return {success:false, error:"could not find this user"};

    try {
        const post = await prisma.post.create({
            data:{
                authorId: userId,
                content,
                image: imageUrl,
            }
        })
    
        revalidatePath("/");
        return {success:true,post}

    } catch (error) {
        console.error("Failed to create post:", error);
        return {success:false,error:"Failed to create post"};
    }
    
}

export async function getAllRelevantPosts() {
    const userId = await getDbUserId();
    if(!userId) return [];

    try {
        const followings = await prisma.follows.findMany({
            where: { followerId: userId },
            select: { followingId: true },
        });
      
        const followingIds = followings.map(f => f.followingId);

        const posts = await prisma.post.findMany({
            where: {
                OR:[
                    {authorId: userId},
                    {authorId:{
                        // the post's author id is one of the user's followers
                        in: followingIds
                    }},
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
    } catch(e) {
        console.log("Error fetching posts", e)
        return[];
    }
}