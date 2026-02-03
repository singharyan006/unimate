"use client";

export default function ReviewsPage() {
    return (
        <div className="p-8 max-w-7xl w-full mx-auto">
            <div className="mb-10">
                <h1 className="text-4xl font-black tracking-tight text-slate-800 dark:text-white mb-2">
                    Student Reviews
                </h1>
                <p className="text-lg text-slate-500 dark:text-slate-400">
                    See what your students are saying about their sessions with you.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-teal-100 dark:border-slate-800 p-8 shadow-sm flex flex-col items-center justify-center py-32 text-center">
                <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/10 p-6 rounded-full">
                    <span className="material-symbols-outlined text-5xl text-yellow-500">star_rate</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                    Reviews & Feedback
                </h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md">
                    You have maintained a 4.9/5.0 star rating! Detailed reviews and feedback comments will be displayed here.
                </p>
            </div>
        </div>
    );
}
