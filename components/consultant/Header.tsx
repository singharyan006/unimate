"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function ConsultantHeader() {
    const pathname = usePathname();

    // Helper to format breadcrumb
    const getBreadcrumb = () => {
        const parts = pathname?.split('/').filter(p => p !== "") || [];
        if (parts.length <= 1) return "Dashboard";

        return parts[parts.length - 1].charAt(0).toUpperCase() + parts[parts.length - 1].slice(1);
    };

    return (
        <header className="flex items-center justify-between px-8 py-4 bg-white dark:bg-slate-900 border-b border-teal-100 dark:border-slate-800 sticky top-0 z-10 transition-colors">
            <div className="flex flex-col">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wide uppercase">
                    <span>UniMate</span>
                    <span className="material-symbols-outlined text-[14px]">
                        chevron_right
                    </span>
                    <span className="text-primary">{getBreadcrumb()}</span>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 bg-secondary dark:bg-slate-800 px-4 py-2 rounded-full border border-primary/10">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">
                        Online
                    </span>
                    {/* Toggle Switch */}
                    <button
                        aria-checked="true"
                        className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-primary"
                        role="switch"
                        type="button"
                    >
                        <span
                            aria-hidden="true"
                            className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5"
                        ></span>
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2 hover:bg-secondary dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <button className="p-2 hover:bg-secondary dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 transition-colors">
                        <span className="material-symbols-outlined">settings</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
