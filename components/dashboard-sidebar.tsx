"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Users,
    Calendar,
    Settings,
    LogOut,
    Video
} from "lucide-react"

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-sky-500",
    },
    {
        label: "Find Mentors",
        icon: Users,
        href: "/mentors",
        color: "text-violet-500",
    },
    {
        label: "My Sessions",
        icon: Video,
        href: "/sessions",
        color: "text-pink-700",
    },
    {
        label: "Calendar",
        icon: Calendar,
        href: "/calendar",
        color: "text-orange-700",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/settings",
    },
]

export function DashboardSidebar() {
    const pathname = usePathname()

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-secondary/30 border-r text-card-foreground">
            <div className="px-3 py-2">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14 gap-2">
                    <img src="/favicon.ico" alt="Logo" className="h-8 w-8 rounded-lg" />
                    <h1 className="text-2xl font-bold text-primary">Unimate.</h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                                pathname === route.href ? "text-primary bg-primary/10" : "text-muted-foreground"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
