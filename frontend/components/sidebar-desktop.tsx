import { Sidebar } from './sidebar'

import { auth } from '@/auth'
import { ChatHistory } from './chat-history'

export async function SidebarDesktop() {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  return (
    <Sidebar className="peer absolute inset-y-0 z-30 bg-background border-r duration-300 ease-in-out hidden lg:flex
      data-[state=collapsed]:w-[50px] 
      data-[state=open]:w-[250px] 
      xl:data-[state=open]:w-[300px]">
      {/* @ts-ignore */}
      <ChatHistory userId={session.user.id} session={session}/>
    </Sidebar>
  )
}