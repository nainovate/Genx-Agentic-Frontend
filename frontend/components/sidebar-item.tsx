'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { motion } from 'framer-motion'

import { buttonVariants } from '@/components/ui/button'
import { IconMessage, IconUsers } from '@/components/ui/icons'
import { cn, formatDate } from '@/lib/utils'
import { type Chat } from '@/lib/types'
import { useSidebar } from '@/lib/hooks/use-sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SidebarItemProps {
  index: number
  chat: Chat
  children: React.ReactNode
}

export function SidebarItem({ index, chat, children }: SidebarItemProps) {
  const pathname = usePathname()
  const { isSidebarOpen } = useSidebar()

  const isActive = pathname === chat.path
  const shouldAnimate = index === 0 && isActive
  const isCollapsed = !isSidebarOpen

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              className="relative h-8"
              variants={{
                initial: {
                  height: 0,
                  opacity: 0
                },
                animate: {
                  height: 'auto',
                  opacity: 1
                }
              }}
              initial={shouldAnimate ? 'initial' : undefined}
              animate={shouldAnimate ? 'animate' : undefined}
              transition={{
                duration: 0.25,
                ease: 'easeIn'
              }}
            >
              <Link
                href={chat.path}
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'group w-full justify-center px-2 h-8',
                  isActive && 'bg-accent'
                )}
              >
                <div className="flex items-center justify-center w-full">
                  <IconMessage className="size-4" />
                </div>
              </Link>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-[200px]">
            <div className="flex flex-col gap-1">
              <div className="font-medium truncate">{chat.title}</div>
              <div className="text-xs text-muted-foreground">
                {formatDate(chat.createdAt)}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <motion.div
      className="relative h-8"
      variants={{
        initial: {
          height: 0,
          opacity: 0
        },
        animate: {
          height: 'auto',
          opacity: 1
        }
      }}
      initial={shouldAnimate ? 'initial' : undefined}
      animate={shouldAnimate ? 'animate' : undefined}
      transition={{
        duration: 0.25,
        ease: 'easeIn'
      }}
    >
      <div className="absolute left-2 top-1 flex size-6 items-center justify-center">
        <IconMessage className="size-4" />
      </div>
      <Link
        href={chat.path}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'group w-full justify-start px-8 h-8',
          isActive && 'bg-accent'
        )}
      >
        <div className="relative max-h-5 flex-1 select-none overflow-hidden text-ellipsis break-all">
          <span className="whitespace-nowrap">
            {shouldAnimate ? (
              chat.title.split('').map((character, index) => (
                <motion.span
                  key={index}
                  variants={{
                    initial: {
                      opacity: 0,
                      x: -100
                    },
                    animate: {
                      opacity: 1,
                      x: 0
                    }
                  }}
                  initial={shouldAnimate ? 'initial' : undefined}
                  animate={shouldAnimate ? 'animate' : undefined}
                  transition={{
                    duration: 0.25,
                    ease: 'easeIn',
                    delay: index * 0.05,
                    staggerChildren: 0.05
                  }}
                >
                  {character}
                </motion.span>
              ))
            ) : (
              <span>{chat.title}</span>
            )}
          </span>
        </div>
      </Link>
      {isActive && <div className="absolute right-2 top-1">{children}</div>}
    </motion.div>
  )
}