"use client"
import { cn } from '@/lib/utils'
import { SidebarToggle } from '@/components/sidebar-toggle'
import darkLogo from '@/public/images/Nainovate_Logo_dark.svg'
import lightLogo from '@/public/images/Nainovate_Logo_light.svg'
import { useSidebar } from '@/lib/hooks/use-sidebar'


export function SidebarHeader({
    children,
    className,
    ...props
}: React.ComponentProps<'div'>) {
const { isSidebarOpen } = useSidebar()

    return (
        <div
            className={cn(`flex items-center justify-between p-3 border-b ${isSidebarOpen ?"":"flex-col"}`, className)}
            {...props}
        >
            <div className="flex items-center gap-2">
                <div className="flex size-[32px] shrink-0 select-none items-center justify-center rounded-md border bg-aiicon text-primary-foreground shadow-sm">
                    <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md bg-aiicon text-primary-foreground shadow-sm">
                        <img
                            src={darkLogo.src}
                            alt="Nainovate Logo"
                            className="h-6 w-6 hidden dark:block"
                        />
                        <img
                            src={lightLogo.src}
                            alt="Nainovate Logo"
                            className="h-6 w-6 block dark:hidden"
                        />
                    </div>
                </div>
            </div>
            <SidebarToggle />
            {children}
        </div>
    )
}