"use client";

import { AdminHeader } from "@/components/admin/Header";
import Link from "next/link";

export default function DisputesPage() {
    return (
        <>
            <AdminHeader title="Disputes" />
            <div className="p-8 flex flex-col gap-8 max-w-[1400px] mx-auto w-full">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm">
                    <Link
                        className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1"
                        href="/admin"
                    >
                        <span className="material-icons-outlined text-sm">home</span>
                        Home
                    </Link>
                    <span className="text-slate-300">/</span>
                    <span className="text-primary font-semibold">Disputes</span>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-background-dark rounded-2xl border border-teal-50 dark:border-slate-800 p-8 shadow-sm text-center py-24">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="material-icons-outlined text-3xl">gavel</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-50">
                        Dispute Center
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
                        Manage and resolve conflicts between students and consultants. No active disputes at the moment.
                    </p>
                    <button className="mt-6 px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
                        View Archive
                    </button>
                </div>
            </div>
        </>
    );
}
