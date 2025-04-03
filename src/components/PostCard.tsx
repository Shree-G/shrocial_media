"use client"

import { toggleLike } from '@/actions/like.action';
import { useUser } from '@clerk/nextjs'
import { Post } from '@prisma/client'
import React, { useState } from 'react'
import toast from 'react-hot-toast';

export default function PostCard({post, dbUserId}: {post:Post, dbUserId:string | null}) {
    const {user} = useUser();
    const [newComment, setNewComment] = useState("");
    const [isCommenting, setIsCommenting] = useState(false);
    const [isLiking, setIsLiking] = useState(false);

    const handleLike = async () => {
        // setIsLiking(true)

        // const result = await toggleLike(post);

        // if (result.success = true) {
        //     toast.success('Successfully Followed!')
        // } else {
        //     toast.error('Something went wrong with following this user')
        // }

        // setIsLiking(false)
    }


  return (
    <div>

    </div>
  )
}
