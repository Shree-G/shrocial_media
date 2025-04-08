"use server"

import { prisma } from "@/lib/prisma";
import { getDbUserId, getUserByClerkId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function getAllNotifications() {
    const userId = await getDbUserId();
    if (!userId) return [];

    try {
        const notifications = await prisma.notification.findMany({
            where: {notifReceiverId: userId},
            orderBy: {createdAt: "desc"},
            include: {
                notifReceiver: true,
                comment: true,
                post: true,
            },
        });
    
        return notifications;
    } catch(e) {
        console.error("Error fetching notifications:", e);
        throw new Error("Failed to fetch notifications");
    }
}

export async function markNotificationAsRead(notifIds: string[]) {
    try {
        await prisma.notification.updateMany({
            where: {
                id: {
                    in: notifIds,
                },
            },
            data: {read: true},
        })
        return {success: true}
    } catch(e) {
        console.error("Error marking notifications as read:", e);
        return {success: false};
    }
}