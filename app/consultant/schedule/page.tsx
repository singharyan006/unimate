"use client";

import Link from "next/link";

export default function SchedulePage() {
    return (
        <div className="p-8 max-w-7xl w-full mx-auto">
            <div className="mb-10 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-800 dark:text-white mb-2">
                        My Schedule
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400">
                        Manage your upcoming sessions and availability.
                    </p>
                </div>
                <button className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">add</span>
                    <span>Set Availability</span>
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-teal-100 dark:border-slate-800 p-8 shadow-sm flex flex-col items-center justify-center py-32 text-center">
                <div className="mb-6 bg-primary/10 p-6 rounded-full">
                    <span className="material-symbols-outlined text-5xl text-primary">calendar_today</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                    Calendar View
                </h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md">
                    Here you will be able to view your full calendar, syncing with your external calendars and managing booking slots.
                </p>
            </div>
        </div>
    );
}
