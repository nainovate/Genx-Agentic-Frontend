"use client"
import { cn } from '@/lib/utils'
import { SidebarToggle } from '@/components/sidebar-toggle'
// import darkLogo from '@/public/images/Nainovate_Logo_dark.svg'
// import lightLogo from '@/public/images/Nainovate_Logo_light.svg'
import logo from '@/public/images/Nainovate.svg'
import { useSidebar } from '@/lib/hooks/use-sidebar'


export function SidebarHeader({
    children,
    className,
    ...props
}: React.ComponentProps<'div'>) {
const { isSidebarOpen } = useSidebar()

    return (
        <div
            className={cn(`flex items-center justify-between p-3 border-b`, className)}
            {...props}
        >
            <div className={`"flex items-center gap-2" ${isSidebarOpen ? '' : 'hidden'}`}>
                <div className="flex shrink-0 select-none items-center justify-center rounded-md bg-aiicon text-primary-foreground">
                    <div className="flex shrink-0 select-none items-center justify-center rounded-md bg-aiicon text-primary-foreground">
                        {/* <img
                            src={darkLogo.src}
                            alt="Nainovate Logo"
                            className="h-6 w-6 hidden dark:block"
                        />
                        <img
                            src={lightLogo.src}
                            alt="Nainovate Logo"
                            className="h-6 w-6 block dark:hidden"
                        /> */}
                        <img
                            src={logo.src}
                            alt="Nainovate Logo"
                            className="h-[30px]"/>
                    </div>
                </div>
            </div>
            <SidebarToggle />
            {children}
        </div>
    )
}