'use client'

import { type Session } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { signOutUser } from '@/app/actions'
import { CircleUser, LogOut } from 'lucide-react'

interface UserMenuProps {
  user: Session['user']
}

function getUserInitials(name: string) {
  const [firstName, lastName] = name.split(' ')
  return lastName ? `${firstName[0]}${lastName[0]}` : firstName.slice(0, 2)
}

export function UserMenu({ user }: UserMenuProps) {

  return (
    <div className="flex w-full justify-between pt-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full flex items-center justify-start gap-4 pl-0"
          >
            <div className="flex size-9 shrink-0 select-none items-center justify-center p-2 rounded-full bg-card text-lg border font-medium uppercase">
              {getUserInitials(user.name)}
            </div>
            <span className="ml-2 text-lg">{user.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={8} align="center" className="w-[250px] bg-muted">
          <DropdownMenuItem className="flex gap-2 items-center">
            <CircleUser className='text-gray-400' />
            <div className="text-lg text-gray-400">{user.email}</div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex gap-2 items-center ">
            <form
              action={async () => {
                await signOutUser()
              }}
              className='w-full'
            >
              <button className="relative flex w-full gap-2 cursor-pointer select-none items-center rounded-sm py-1 text-lg outline-none transition-colors hover:bg-primary hover:text-primary-foreground focus:bg-accent focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                <LogOut /> <span>Sign Out</span>
              </button>
            </form>
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
