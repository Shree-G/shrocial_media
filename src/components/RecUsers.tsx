import { getRandomUsers } from '@/actions/user.action';
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarImage } from './ui/avatar';
import Link from 'next/link';
import FollowButton from './FollowButton';

export default async function RecUsers() {
    const users = await getRandomUsers();
    if(!users || users.length === 0) { return}

    return (
        <Card className='sticky top-20'>
          <CardHeader>
            <CardTitle>Who to Follow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex gap-2 items-center justify-between ">
                  <div className="flex items-center gap-1">
                    <Link href={`/profile/${user.username}`}>
                    <Avatar>
                        <AvatarImage src={user.image ?? "/avatar.png"} />
                    </Avatar>
                    </Link>
                    <div className="text-xs">
                      <Link href={`/profile/${user.username}`} className="font-medium cursor-pointer">
                        {user.name}
                      </Link>
                      <p className="text-muted-foreground">@{user.username}</p>
                      <p className="text-muted-foreground">{user._count.followers} followers</p>
                    </div>
                  </div>
                  <FollowButton userId={user.id} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      );

    // return (
    //     <div>
    //         <h1>Who to Follow</h1>
    //       {users.map((user) => (
    //         <Card key={user.id} className='mt-2'>
    //             <CardContent className='flex justify-between mx-auto my-auto'>
    //                 <div className='flex items-center gap-2'>
    //                     <Avatar className="w-5 h-5 border-2 ">
    //                         <AvatarImage src={user.image || "/avatar.png"} />
    //                     </Avatar>
    //                     <span className=''>{user.name}</span>
    //                 </div>
    //                 <Button>Follow</Button>
    //             </CardContent>
    //         </Card>
    //       ))}
    //     </div>
    //   );
}
