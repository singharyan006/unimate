"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminSidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path || pathname?.startsWith(`${path}/`);
    };

    const getLinkClass = (path: string) => {
        const active = path === "/admin" ? pathname === "/admin" : isActive(path);

        if (active) {
            return "flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary group transition-all";
        }
        return "flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-all";
    };

    return (
        <aside className="w-64 border-r border-teal-100 dark:border-slate-800 bg-white dark:bg-background-dark flex flex-col fixed h-full shadow-sm z-20">
            <div className="p-6 flex flex-col h-full justify-between">
                <div className="flex flex-col gap-8">
                    <div className="flex gap-3 items-center">
                        <div className="bg-primary rounded-xl p-2 flex items-center justify-center shadow-md shadow-primary/20">
                            <span className="material-icons-outlined text-white text-2xl">school</span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-slate-800 dark:text-slate-50 text-xl font-bold leading-tight tracking-tight">
                                UniMate
                            </h1>
                            <p className="text-primary font-medium text-[10px] uppercase tracking-widest">
                                Admin Console
                            </p>
                        </div>
                    </div>
                    <nav className="flex flex-col gap-1.5">
                        <Link
                            className={getLinkClass("/admin")}
                            href="/admin"
                        >
                            <span className="material-icons-outlined">dashboard</span>
                            <span className="text-sm font-bold">Dashboard</span>
                        </Link>
                        <Link
                            className={getLinkClass("/admin/verifications")}
                            href="/admin/verifications"
                        >
                            <span className="material-icons-outlined">verified_user</span>
                            <span className="text-sm font-medium">Verifications</span>
                        </Link>
                        <Link
                            className={getLinkClass("/admin/disputes")}
                            href="/admin/disputes"
                        >
                            <span className="material-icons-outlined">gavel</span>
                            <span className="text-sm font-medium">Disputes</span>
                        </Link>
                        <Link
                            className={getLinkClass("/admin/users")}
                            href="/admin/users"
                        >
                            <span className="material-icons-outlined">group</span>
                            <span className="text-sm font-medium">Users</span>
                        </Link>
                        <Link
                            className={getLinkClass("/admin/reports")}
                            href="/admin/reports"
                        >
                            <span className="material-icons-outlined">analytics</span>
                            <span className="text-sm font-medium">Reports</span>
                        </Link>
                    </nav>
                </div>
                <div className="flex flex-col gap-4">
                    <button className="flex items-center justify-center gap-2 w-full rounded-xl h-11 bg-primary text-white text-sm font-bold tracking-tight hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                        <span className="material-icons-outlined text-sm">add</span>
                        <span>New Report</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
