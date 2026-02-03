"use client";

export default function EarningsPage() {
    return (
        <div className="p-8 max-w-7xl w-full mx-auto">
            <div className="mb-10">
                <h1 className="text-4xl font-black tracking-tight text-slate-800 dark:text-white mb-2">
                    Earnings & Payouts
                </h1>
                <p className="text-lg text-slate-500 dark:text-slate-400">
                    Track your revenue, pending payouts, and transaction history.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-primary text-white rounded-2xl p-8 flex flex-col justify-between shadow-xl shadow-primary/10 relative overflow-hidden h-48">
                    <div className="absolute -right-4 -top-4 opacity-10">
                        <span className="material-symbols-outlined text-9xl">payments</span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs font-black uppercase tracking-[0.15em] opacity-80 mb-4">Total Earnings</p>
                        <p className="text-4xl font-black">$1,240.00</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-teal-100 dark:border-slate-800 p-8 flex flex-col justify-between shadow-sm h-48">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 mb-4">Pending Payout</p>
                        <p className="text-4xl font-black text-slate-800 dark:text-white">$340.00</p>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">Next payout on Nov 1st</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-teal-100 dark:border-slate-800 p-8 flex flex-col justify-between shadow-sm h-48">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 mb-4">Completed Sessions</p>
                        <p className="text-4xl font-black text-slate-800 dark:text-white">12</p>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">+2 from last month</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-teal-100 dark:border-slate-800 p-8 shadow-sm flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-6 bg-slate-100 dark:bg-slate-800 p-6 rounded-full">
                    <span className="material-symbols-outlined text-4xl text-slate-400">receipt_long</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                    Transaction History
                </h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                    Your detailed transaction history will appear here once you have more activity.
                </p>
            </div>
        </div>
    );
}
