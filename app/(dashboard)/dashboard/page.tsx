"use client";

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
    IconCalendarEvent,
    IconSchool,
    IconSearch,
    IconUserCheck,
    IconBook,
    IconMessageCircle,
} from "@tabler/icons-react"; // Note: I might need to install this or use Lucide
import {
    Calendar,
    Users,
    Search,
    Sparkles,
    BookOpen,
    MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    return (
        <div className="p-8">
            <div className="mb-8">
                <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-800 to-neutral-500 dark:from-neutral-200 dark:to-neutral-500">
                    Welcome back, Alex! 👋
                </h2>
                <p className="text-muted-foreground mt-2 font-light text-lg">
                    Your college application journey continues here.
                </p>
            </div>

            <BentoGrid className="max-w-full">
                {/* Item 1: Upcoming Sessions (Large) */}
                <BentoGridItem
                    title="Upcoming Sessions"
                    description={
                        <div className="mt-2 text-sm">
                            <div className="flex items-center gap-2 mb-2 p-2 rounded bg-neutral-100 dark:bg-neutral-800">
                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                <span className="font-medium">College Essay Workshop</span>
                                <span className="ml-auto text-xs text-muted-foreground">Tomorrow, 4 PM</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded bg-neutral-100 dark:bg-neutral-800">
                                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                                <span className="font-medium">Mock Interview with Sarah</span>
                                <span className="ml-auto text-xs text-muted-foreground">Wed, 10 AM</span>
                            </div>
                        </div>
                    }
                    header={<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20" />}
                    icon={<Calendar className="h-6 w-6 text-violet-500" />}
                    className="md:col-span-2"
                />

                {/* Item 2: Mentors Viewed (Sparkline placeholder) */}
                <BentoGridItem
                    title="Mentors Viewed"
                    description="12 mentors viewed this week."
                    header={
                        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 items-end overflow-hidden pb-4 px-4">
                            {/* Simple CSS Sparkline */}
                            <div className="flex items-end justify-between w-full h-1/2 gap-1">
                                {[40, 60, 45, 80, 55, 90, 70].map((h, i) => (
                                    <div key={i} className="bg-blue-500/50 w-full rounded-t-sm" style={{ height: `${h}%` }}></div>
                                ))}
                            </div>
                        </div>
                    }
                    icon={<Users className="h-6 w-6 text-blue-500" />}
                    className="md:col-span-1"
                />

                {/* Item 3: Find a Mentor (Action) */}
                <BentoGridItem
                    title="Find a Mentor"
                    description="Browse our network of students from top universities."
                    header={
                        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-dot-black/[0.2] dark:bg-dot-white/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)] border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Button variant="default" className="shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-violet-600 to-indigo-600 border-0">
                                    Search Now
                                </Button>
                            </div>
                        </div>
                    }
                    icon={<Search className="h-6 w-6 text-indigo-500" />}
                    className="md:col-span-1"
                />

                {/* Item 4: Application Progress */}
                <BentoGridItem
                    title="Application Progress"
                    description="You have completed 90% of your profile."
                    header={
                        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                            <div className="relative h-20 w-20 rounded-full border-8 border-emerald-500/30 flex items-center justify-center">
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">90%</span>
                                <svg className="absolute inset-0 h-full w-full -rotate-90 stroke-emerald-500" viewBox="0 0 100 100" fill="none" strokeWidth="8" strokeDasharray="251" strokeDashoffset="25">
                                    {/* Simple circle logic would go here, effectively handled by border for now/css above */}
                                </svg>
                            </div>
                        </div>
                    }
                    icon={<Sparkles className="h-6 w-6 text-emerald-500" />}
                    className="md:col-span-1"
                />

                {/* Item 5: Messages / Social */}
                <BentoGridItem
                    title="Messages"
                    description="3 unread messages."
                    header={
                        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 p-4 space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-pink-200"></div>
                                <div className="h-2 w-24 bg-pink-200/50 rounded"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-pink-300"></div>
                                <div className="h-2 w-32 bg-pink-300/50 rounded"></div>
                            </div>
                        </div>
                    }
                    icon={<MessageSquare className="h-6 w-6 text-pink-500" />}
                    className="md:col-span-1"
                />

            </BentoGrid>
        </div>
    );
}
