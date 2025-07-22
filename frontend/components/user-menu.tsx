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
import { useRouter } from 'next/navigation'
import { signOutUser } from '@/app/actions'
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
            <div className="flex size-9 shrink-0 select-none items-center justify-center p-2 rounded-full bg-muted/50 text-lg border font-medium uppercase">
              {getUserInitials(user.email)}
            </div>
            <span className="ml-2 text-lg">{user.email}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={8} align="start" className="w-fit bg-muted">
          <DropdownMenuItem className="flex-col items-start">
          </DropdownMenuItem>            <div className="text-xs text-foreground">{user.email}</div>

          <DropdownMenuSeparator />
          <form
            action={async () => {
              await signOutUser
            }}
          >
            <button className=" relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none transition-colors hover:bg-primary hover:text-primary-foreground focus:bg-accent focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
              Sign Out
            </button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
