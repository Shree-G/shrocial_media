"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { shuffle } from 'lodash';
import { revalidatePath } from "next/cache";

export async function syncUser() {
    try {
        const {userId} = await auth()
        const user = await currentUser()
        if(!userId || !user) {
            return
        }

        const existingUser = await prisma.user.findUnique({
            where:{
                clerkId:userId
            }
        })

        if (existingUser) return existingUser;


        const dbUser = await prisma.user.create({
            data:{
                clerkId: userId,
                name: `${user.firstName ?? ""} ${user.lastName ?? ""}`,
                username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
                email: user.emailAddresses[0].emailAddress,
                image: user.imageUrl,
            }
        })

        return dbUser
        
    } catch (error) {
        console.log("Error in syncUser", error)
    }
}

export async function getUserByClerkId() {
    const {userId} = await auth()

    if (!userId) return null;

    const dbUser = await prisma.user.findUnique({
        where: {
          clerkId: userId,
        },
        include: {
            _count: {
              select: {
                posts: true,
                likes: true,
                comments: true,
                followers: true,
                following: true, 
                },
            },
          },
      })

      return dbUser
}

export async function getDbUserId() {
    const user = await getUserByClerkId();

    if(!user) return null;

    return user.id
}

export async function getRandomUsers() {
    const userId = await getDbUserId();
    if (!userId) return null;

    try {
        const candidates = await prisma.user.findMany({ 
            where: {
                AND:[
                    {NOT:{id: userId}},
                    {
                        NOT:{
                            followers:{
                                some:{
                                    followerId: userId
                                }
                            }
                        } 
                    },
                ]
            },
            select:{
                id: true,
                name: true,
                username: true,
                image: true,
                _count:{
                    select:{
                        followers: true,
                    }
                }
            },
            take: 3,
        })

        const dbUsers = shuffle(candidates).slice(0,3)
    
        return dbUsers;
    } catch(e) {
        console.log("Error fetching random users", e)
        return[];
    }
    
}

export async function toggleFollow(otherUserId:string) {
    const thisUserId = await getDbUserId();
    if(!thisUserId) return {success:false, error:"could not find this user"};

    if(thisUserId === otherUserId){
        throw new Error("You cannot follow yourself!");
    }

    try {
        const followed = await prisma.follows.findUnique({
            where: {
                followerId_followingId: {
                    followerId: thisUserId,
                    followingId: otherUserId,
                }
            },
        })
    
        if (followed) {
            // unfollow
            await prisma.follows.delete({
                where: {
                    followerId_followingId: {
                        followerId: thisUserId,
                        followingId: otherUserId,
                    }
                }
            })
    
        } else {
            // follow
            await prisma.$transaction([
                prisma.follows.create({
                    data: {
                        followerId: thisUserId,
                        followingId: otherUserId,
                    }
                }),
    
                prisma.notification.create({
                    data: {
                        type: "FOLLOW",
                        notifCreatorId: thisUserId,
                        notifReceiverId: otherUserId,
                    }
                })
            ])
        }
        revalidatePath("/");
        return {success:true}
    } catch(e) {
        return {success:false, error: "error with followToggle"}
    }

    
}
