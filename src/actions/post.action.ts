"use server"

import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function createPost(content:string, imageUrl:string) {
    const userId = await getDbUserId();
    

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