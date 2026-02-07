"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export function ConsultantSidebar() {
    const pathname = usePathname();
    const { user } = useUser();

    const isActive = (path: string) => {
        return pathname === path || pathname?.startsWith(`${path}/`);
    };

    const getLinkClass = (path: string) => {
        const active = path === "/consultant" ? pathname === "/consultant" : isActive(path);

        if (active) {
            return "flex items-center gap-3 px-4 py-2.5 rounded-xl bg-primary/10 text-primary font-bold transition-all";
        }
        return "flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-secondary dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium transition-colors";
    };

    return (
        <aside className="w-64 border-r border-teal-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0">
            <div className="p-6 flex items-center gap-3">
                <div className="size-10 flex items-center justify-center">
                    <svg
                        className="w-full h-full text-primary"
                        fill="currentColor"
                        viewBox="0 0 100 100"
                    >
                        <path d="M50 15L10 35L50 55L90 35L50 15Z"></path>
                        <path d="M20 45V65C20 65 30 75 50 75C70 75 80 65 80 65V45L50 60L20 45Z"></path>
                        <rect height="25" rx="2" width="4" x="82" y="38"></rect>
                    </svg>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
                    UniMate
                </h2>
            </div>
            <div className="flex flex-col gap-1 px-4 grow">
                <Link
                    className={getLinkClass("/consultant")}
                    href="/consultant"
                >
                    <span className="material-symbols-outlined fill-icon">dashboard</span>
                    <span>Dashboard</span>
                </Link>
                <Link
                    className={getLinkClass("/consultant/schedule")}
                    href="/consultant/schedule"
                >
                    <span className="material-symbols-outlined">calendar_today</span>
                    <span>Schedule</span>
                </Link>
                <Link
                    className={getLinkClass("/consultant/earnings")}
                    href="/consultant/earnings"
                >
                    <span className="material-symbols-outlined">payments</span>
                    <span>Earnings</span>
                </Link>
                <Link
                    className={getLinkClass("/consultant/reviews")}
                    href="/consultant/reviews"
                >
                    <span className="material-symbols-outlined">star</span>
                    <span>Reviews</span>
                </Link>
                <Link
                    className={getLinkClass("/consultant/profile")}
                    href="/consultant/profile"
                >
                    <span className="material-symbols-outlined">person</span>
                    <span>Profile</span>
                </Link>
            </div>
            <div className="p-6 mt-auto border-t border-teal-100 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-4">
                    <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-11 border-2 border-primary/20"
                        style={{
                            backgroundImage: `url("${user?.imageUrl || ''}")`,
                        }}
                    ></div>
                    <div className="flex flex-col overflow-hidden">
                        <h1 className="text-sm font-bold truncate text-slate-800 dark:text-white">
                            {user?.fullName || 'Consultant'}
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            Consultant
                        </p>
                    </div>
                </div>
                <Link
                    className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-sm shadow-primary/20 block text-center"
                    href="/consultant/profile"
                >
                    View Profile
                </Link>
            </div>
        </aside>
    );
}
