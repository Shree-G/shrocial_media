import { currentUser } from '@clerk/nextjs/server'
import React from 'react'
import UnauthenticatedSidebar from './UnauthenticatedSidebar';

export default async function Sidebar() {
    const authUser = await currentUser();

    if(!authUser) return <UnauthenticatedSidebar />;

  return (
    <div>
      
    </div>
  )
}
