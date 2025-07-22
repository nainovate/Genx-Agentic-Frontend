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
'use client'

import { useState, useEffect } from 'react'
import { ClearHistory } from '@/components/clear-history'
import { SidebarItems } from '@/components/sidebar-items'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserMenu } from '@/components/user-menu'
import { SidebarFooter } from '@/components/sidebar-footer'
import { getChats, clearChats } from '@/app/actions'
import { Session } from '@/lib/types'

interface SidebarListProps {
  session?: Session
}

export function SidebarList({ session }: SidebarListProps) {
  const [chats, setChats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const chatData = await getChats(session.user.id)
        setChats(chatData || [])
        
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [session])

  if (loading) {
    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-2 space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 rounded-md animate-pulse bg-muted" />
          ))}
        </div>
        <SidebarFooter>
          <div className="flex items-center justify-between gap-2">
            <div className="h-8 w-8 rounded-md animate-pulse bg-muted" />
            <div className="h-8 w-8 rounded-md animate-pulse bg-muted" />
          </div>
          <div className="h-8 w-8 rounded-full animate-pulse bg-muted mt-2" />
        </SidebarFooter>
      </div>
    )
  }

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
        <div className="flex w-full items-center justify-between px-2 gap-2">
          <ThemeToggle />
          <ClearHistory 
            clearChats={clearChats} 
            isEnabled={chats?.length > 0} 
          />
        </div>
        {session?.user && (
          <UserMenu user={session.user} />
        )}
      </SidebarFooter>
    </div>
  )
}