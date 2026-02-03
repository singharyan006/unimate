"use client";

import Link from "next/link";

export default function ProfilePage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50 dark:bg-slate-900/50">
            {/* Cover Image Section */}
            <div className="h-48 w-full bg-gradient-to-r from-teal-500 to-primary relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            </div>

            <div className="max-w-7xl mx-auto w-full px-8 pb-12 -mt-20">
                {/* Profile Header Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-teal-100 dark:border-slate-800 shadow-sm p-6 mb-8 relative">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative">
                            <div
                                className="w-32 h-32 rounded-2xl bg-cover bg-center border-4 border-white dark:border-slate-800 shadow-lg"
                                style={{
                                    backgroundImage:
                                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDw3Q3AJjM0SEzV6DJt83Sk1pQS6ao3XPN2rBJIuyuKGJjlIF5WBk_hEVQHTgbB0pcFFHR_jrIvap85yNuohYOd5G66Lcilo9twQ7iib6JQBShoI-FBzR3HKDFdWTBy3B5uCNTd4Z9s1NT3_ZCySBknpevT5PaPdJpTsEsPdAq9jSo_9O_FxQh17ERIOiNtTZJIHEjGZJAgd_fuWR3QTmA5zCWwQ3QJNpF-ebF9VjDcU-WFlJAqJejxP8UHeUwrXNfZqqYnIBAS0ig")',
                                }}
                            ></div>
                            <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white dark:border-slate-900" title="Online"></div>
                        </div>
                        <div className="flex-1 mb-2">
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                                    Alex Johnson
                                </h1>
                                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded">Verified</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">
                                Senior Consultant • Ivy League Specialist
                            </p>
                            <div className="flex gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-lg">location_on</span>
                                    New York, USA
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-lg">schedule</span>
                                    EST (UTC-5)
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mb-2 w-full md:w-auto">
                            <button className="flex-1 md:flex-none px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-sm">share</span>
                                Share Profile
                            </button>
                            <button className="flex-1 md:flex-none px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-sm">edit</span>
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Detailed Info */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        {/* About Me */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-teal-100 dark:border-slate-800 shadow-sm p-8">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">About Me</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                With over 8 years of experience in higher education consulting, I specialize in helping ambitious students secure admissions to top-tier universities. My approach combines strategic essay crafting, rigorous interview preparation, and holistic application reviews.
                            </p>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                I differ from other consultants by focusing deeply on each student's unique narrative, drawing out the personal stories that admissions officers connect with emotionally. I've successfully guided over 200 students to Ivy League and Top 20 institutions.
                            </p>
                        </div>

                        {/* Education & Credentials */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-teal-100 dark:border-slate-800 shadow-sm p-8">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Education & Credentials</h3>
                            <div className="flex flex-col gap-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-2xl">school</span>
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-slate-800 dark:text-white">Master of Education (M.Ed.)</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Harvard University • 2016-2018</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-2xl">history_edu</span>
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-slate-800 dark:text-white">B.A. in English Literature</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Yale University • 2012-2016</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/20 text-teal-600 rounded-xl flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-2xl">verified</span>
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-slate-800 dark:text-white">Certified Educational </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">IECA Professional Member</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Stats & Insights */}
                    <div className="flex flex-col gap-8">
                        {/* Highlights */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-teal-100 dark:border-slate-800 shadow-sm p-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6">Highlights</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-center">
                                    <p className="text-2xl font-black text-slate-800 dark:text-white mb-1">200+</p>
                                    <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Students</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-center">
                                    <p className="text-2xl font-black text-slate-800 dark:text-white mb-1">4.9</p>
                                    <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Rating</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-center">
                                    <p className="text-2xl font-black text-slate-800 dark:text-white mb-1">1.2k</p>
                                    <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Hours</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-center">
                                    <p className="text-2xl font-black text-slate-800 dark:text-white mb-1">98%</p>
                                    <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Success</p>
                                </div>
                            </div>
                        </div>

                        {/* Expertise Tags */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-teal-100 dark:border-slate-800 shadow-sm p-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6">Expertise</h3>
                            <div className="flex flex-wrap gap-2">
                                {["Essay Editing", "Interview Prep", "Ivy League", "Common App", "Scholarships", "Career Guidance", "Arts Portfolio"].map((tag) => (
                                    <span key={tag} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Languages */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-teal-100 dark:border-slate-800 shadow-sm p-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6">Languages</h3>
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-slate-800 dark:text-white">English</span>
                                    <span className="text-slate-500 dark:text-slate-400">Native</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-slate-800 dark:text-white">Spanish</span>
                                    <span className="text-slate-500 dark:text-slate-400">Professional</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-slate-800 dark:text-white">French</span>
                                    <span className="text-slate-500 dark:text-slate-400">Conversational</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
