// import { clearChats, getChats } from '@/app/actions'
// import { ClearHistory } from '@/components/clear-history'
// import { SidebarItems } from '@/components/sidebar-items'
// import { ThemeToggle } from '@/components/theme-toggle'
// import { cache } from 'react'

// interface SidebarListProps {
//   userId?: string
//   children?: React.ReactNode
// }

// const loadChats = cache(async (userId?: string) => {
//   return await getChats(userId)
// })

// export async function SidebarList({ userId }: SidebarListProps) {
//   const chats = await loadChats(userId)
//   return (
//     <div className="flex flex-1 flex-col overflow-hidden">
//       <div className="flex-1 overflow-auto">
//         {chats?.length ? (
//           <div className="space-y-2 px-2">
//             <SidebarItems chats={chats} />
//           </div>
//         ) : (
//           <div className="p-8 text-center">
//             <p className="text-sm text-muted-foreground">No chat history</p>
//           </div>
//         )}
//       </div>
//       <div className="flex items-center justify-between p-4">
//         <ThemeToggle />
//         <ClearHistory clearChats={clearChats} isEnabled={chats?.length > 0} />
//       </div>
//     </div>
//   )
// }
import { clearChats, getChats } from '@/app/actions'
import { ClearHistory } from '@/components/clear-history'
import { SidebarItems } from '@/components/sidebar-items'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserMenu } from '@/components/user-menu'
import { SidebarFooter } from '@/components/sidebar-footer'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { cache } from 'react'

interface SidebarListProps {
  userId?: string
  children?: React.ReactNode
}

const loadChats = cache(async (userId?: string) => {
  return await getChats(userId)
})

export async function SidebarList({ userId }: SidebarListProps) {
  const chats = await loadChats(userId)
  const session = (await auth()) as Session
  
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        {chats?.length ? (
          <div className="space-y-2 px-2">
            <SidebarItems chats={chats} />
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No chat history</p>
          </div>
        )}
      </div>
      <SidebarFooter>
        <div className="flex w-full items-center justify-between gap-2">
          <ThemeToggle />
          <ClearHistory clearChats={clearChats} isEnabled={chats?.length > 0} />
        </div>
        {session?.user && (
          <UserMenu user={session.user} />
        )}
      </SidebarFooter>
    </div>
  )
}