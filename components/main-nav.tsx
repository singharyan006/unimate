"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs" // Using Clerk

export function MainNav() {
    const pathname = usePathname()

    const routes = [
        {
            href: "/mentors",
            label: "Find a Mentor",
            active: pathname === "/mentors",
        },
        {
            href: "/about",
            label: "How it works",
            active: pathname === "/about",
        },
    ]

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2">
                            <img src="/favicon.ico" alt="Logo" className="h-10 w-10 rounded-lg" />
                            <span className="text-xl font-bold tracking-tight text-primary">UniMate</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-6">
                            {routes.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-primary",
                                        route.active ? "text-primary" : "text-muted-foreground"
                                    )}
                                >
                                    {route.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <SignedIn>
                            <Link href="/dashboard">
                                <Button variant="ghost" size="sm">Dashboard</Button>
                            </Link>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                        <SignedOut>
                            <Link href="/sign-in">
                                <Button variant="ghost" size="sm">
                                    Log in
                                </Button>
                            </Link>
                            <Link href="/sign-up">
                                <Button size="sm">
                                    Sign up
                                </Button>
                            </Link>
                        </SignedOut>
                    </div>
                </div>
            </div>
        </nav>
    )
}
