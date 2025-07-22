import * as React from 'react'
import Link from 'next/link'

import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import { SidebarMobile } from './sidebar-mobile'
import { ChatHistory } from './chat-history'
import { Session } from '@/lib/types'
import { ThemeSelect } from './theme-select'

async function UserOrLogin() {
  const session = (await auth()) as Session
  
  return (
    <>
      {session?.user ? (
        <SidebarMobile>
          <ChatHistory session={session}/>
        </SidebarMobile>
      ) : (
        <Button variant="link" asChild className="-ml-2">
          <Link href="/login">Login</Link>
        </Button>
      )}
    </>
  )
}

export async function Header() {
  const session = (await auth()) as Session

  return (
    <header className="sticky block md:hidden top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <UserOrLogin />
        </React.Suspense>
      </div>
      {!session?.user && <ThemeSelect />}
    </header>
  )
}