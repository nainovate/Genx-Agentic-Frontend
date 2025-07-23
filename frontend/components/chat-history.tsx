'use client'

import * as React from 'react'
import { useSidebar } from '@/lib/hooks/use-sidebar'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { SidebarList } from '@/components/sidebar-list'
import { SidebarHeader } from '@/components/sidebar-header'
import { buttonVariants } from '@/components/ui/button'
import { IconPlus, IconUsers } from '@/components/ui/icons'
import { AgentsList } from '@/components/agents-list'
import { agentsInfo } from '@/app/(chat)/agent/actions'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Session } from '@/lib/types'

interface ChatHistoryProps {
  session?: Session
}

export function ChatHistory({ session }: ChatHistoryProps) {
  const { isSidebarOpen } = useSidebar()
  // const [agents, setAgents] = React.useState<any>(null)
  // const [loading, setLoading] = React.useState(true)

  // React.useEffect(() => {
  //   async function fetchAgents() {
  //     try {
  //       setLoading(true)
  //       const data = await agentsInfo(session?.user.id)
  //       setAgents(data)
  //     } catch (error) {
  //       console.error('Failed to fetch agents:', error)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchAgents()
  // }, [session])

  return (
    <div className={cn("flex flex-col h-full", isSidebarOpen ? "py-1" : "")}>
      <SidebarHeader />
      
      {/* Agents Button */}
      <div className={cn("mb-2 mt-2 px-2", !isSidebarOpen && "px-1")}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/agent"
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'h-10 w-full justify-start bg-zinc-50 px-4 shadow-none transition-colors bg-card hover:bg-muted',
                  !isSidebarOpen && 'justify-center px-0'
                )}
              >
                <IconUsers className={cn(
                  "-translate-x-2 stroke-2",
                  !isSidebarOpen && "mx-0 translate-x-0"
                )} />
                <span className={!isSidebarOpen ? "hidden" : ""}>Agents</span>
              </Link>
            </TooltipTrigger>
            {!isSidebarOpen && (
              <TooltipContent side="right">
                <p>Agents</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Agents List */}
      {/* <div className={cn(
        "flex flex-col px-4 space-y-4 overflow-auto",
        !isSidebarOpen && "px-1 space-y-2"
      )}>
        {loading ? (
          <div className={cn(
            "flex flex-col flex-1 px-4 space-y-4 overflow-auto",
            !isSidebarOpen && "px-1"
          )}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-6 rounded-md shrink-0 animate-pulse bg-muted"
              />
            ))}
          </div>
        ) : (
          <AgentsList userId={session?.user.id} agents={agents} />
        )}
      </div> */}
      
      {/* New Chat Button */}
      <div className={cn("mb-2 px-2", !isSidebarOpen && "px-1")}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/"
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'h-10 w-full justify-start px-4 shadow-none transition-colors bg-card hover:bg-muted',
                  !isSidebarOpen && 'justify-center px-0'
                )}
              >
                <IconPlus className={cn(
                  "-translate-x-2 stroke-2",
                  !isSidebarOpen && "mx-0 translate-x-0"
                )} />
                <span className={!isSidebarOpen ? "hidden" : ""}>New Chat</span>
              </Link>
            </TooltipTrigger>
            {!isSidebarOpen && (
              <TooltipContent side="right">
                <p>New Chat</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Chat History */}
      <React.Suspense
        fallback={
          <div className={cn(
            "flex flex-col flex-1 px-4 space-y-4 overflow-auto",
            !isSidebarOpen && "px-1"
          )}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-6 rounded-md shrink-0 animate-pulse bg-muted"
              />
            ))}
          </div>
        }
      >
        <SidebarList session={session} />
      </React.Suspense>
    </div>
  )
}