import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { Button } from './ui/button'

export default function UnauthenticatedSidebar() {
  return (
    <Card className='sticky top-0'>
        <CardHeader className='gap-3'>
            <CardTitle className='text-center font-mono font-bold text-2xl'>Welcome Back!</CardTitle>
            <CardDescription className='text-center tracking-tighter text-base'>Sign in to access your profile and connect with others. Or sign up!</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col items-center gap-2'>
            <SignInButton mode="modal">
                <Button variant="outline" className='w-full'>Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
                <Button variant="default" className='w-full'>Sign Up</Button>
            </SignUpButton>
        </CardContent>
    </Card>
  )
}
