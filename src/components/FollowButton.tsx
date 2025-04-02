"use client"

import React, { useState } from 'react'
import { Button } from './ui/button';
import { Loader2Icon } from 'lucide-react';
import { toggleFollow } from '@/actions/user.action';
import toast from 'react-hot-toast';

export default function FollowButton({userId} : {userId:string}) {
    const [isLoading, setIsLoading] = useState(false);

    const handleFollow = async () => {
        setIsLoading(true);

        const result = await toggleFollow(userId);

        if (result.success = true) {
            toast.success('Successfully Followed!')
        } else {
            toast.error('Something went wrong with following this user')
        }

        setIsLoading(false)
    }

  return (
    <Button size="sm" variant="secondary" disabled={isLoading} className='w-20' onClick={handleFollow}>
        {isLoading ? <Loader2Icon className='size-4 animate-spin'/> : "Follow"}
    </Button>
  )
}
