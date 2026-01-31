import Link from "next/link";

export default function ConsultantDashboard() {
    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-50 transition-colors duration-200 font-sans">
            {/* Sidebar */}
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
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-primary/10 text-primary font-bold transition-all"
                        href="#"
                    >
                        <span className="material-symbols-outlined fill-icon">dashboard</span>
                        <span>Dashboard</span>
                    </Link>
                    <Link
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-secondary dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium transition-colors"
                        href="#"
                    >
                        <span className="material-symbols-outlined">calendar_today</span>
                        <span>Schedule</span>
                    </Link>
                    <Link
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-secondary dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium transition-colors"
                        href="#"
                    >
                        <span className="material-symbols-outlined">payments</span>
                        <span>Earnings</span>
                    </Link>
                    <Link
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-secondary dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium transition-colors"
                        href="#"
                    >
                        <span className="material-symbols-outlined">star</span>
                        <span>Reviews</span>
                    </Link>
                    <Link
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-secondary dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium transition-colors"
                        href="#"
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
                                backgroundImage:
                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDw3Q3AJjM0SEzV6DJt83Sk1pQS6ao3XPN2rBJIuyuKGJjlIF5WBk_hEVQHTgbB0pcFFHR_jrIvap85yNuohYOd5G66Lcilo9twQ7iib6JQBShoI-FBzR3HKDFdWTBy3B5uCNTd4Z9s1NT3_ZCySBknpevT5PaPdJpTsEsPdAq9jSo_9O_FxQh17ERIOiNtTZJIHEjGZJAgd_fuWR3QTmA5zCWwQ3QJNpF-ebF9VjDcU-WFlJAqJejxP8UHeUwrXNfZqqYnIBAS0ig")',
                            }}
                        ></div>
                        <div className="flex flex-col overflow-hidden">
                            <h1 className="text-sm font-bold truncate text-slate-800 dark:text-white">
                                Alex Johnson
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                Senior Consultant
                            </p>
                        </div>
                    </div>
                    <button className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-sm shadow-primary/20">
                        View Profile
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-y-auto">
                <header className="flex items-center justify-between px-8 py-4 bg-white dark:bg-slate-900 border-b border-teal-100 dark:border-slate-800 sticky top-0 z-10 transition-colors">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wide uppercase">
                            <span>UniMate</span>
                            <span className="material-symbols-outlined text-[14px]">
                                chevron_right
                            </span>
                            <span className="text-primary">Dashboard</span>
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
                <div className="p-8 max-w-7xl w-full mx-auto">
                    <div className="mb-10">
                        <h1 className="text-4xl font-black tracking-tight text-slate-800 dark:text-white mb-2">
                            Consultant Dashboard
                        </h1>
                        <p className="text-lg text-slate-500 dark:text-slate-400">
                            Welcome back, Alex. You have 3 sessions remaining today.
                        </p>
                    </div>
                    <div className="grid grid-cols-12 gap-8">
                        {/* Next Session Card */}
                        <div className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-teal-100 dark:border-slate-800 p-8 shadow-sm">
                            <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                                <div>
                                    <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-[11px] font-black uppercase tracking-widest rounded-full mb-4">
                                        NEXT SESSION
                                    </span>
                                    <h3 className="text-3xl font-bold text-slate-800 dark:text-white">
                                        Ivy League Prep
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                                        with{" "}
                                        <span className="font-bold text-primary">Sarah Jenkins</span>
                                    </p>
                                </div>
                                <button className="px-8 py-4 bg-primary text-white rounded-xl font-bold shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-3">
                                    <span className="material-symbols-outlined">videocam</span>
                                    Join Video Call
                                </button>
                            </div>
                            <div className="flex gap-6 max-w-lg">
                                <div className="flex grow basis-0 flex-col items-center gap-3">
                                    <div className="w-full flex h-20 items-center justify-center rounded-2xl bg-secondary dark:bg-slate-800 border border-primary/10">
                                        <p className="text-3xl font-black text-primary">00</p>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                                        Hours
                                    </p>
                                </div>
                                <div className="flex grow basis-0 flex-col items-center gap-3">
                                    <div className="w-full flex h-20 items-center justify-center rounded-2xl bg-secondary dark:bg-slate-800 border border-primary/10">
                                        <p className="text-3xl font-black text-primary">15</p>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                                        Minutes
                                    </p>
                                </div>
                                <div className="flex grow basis-0 flex-col items-center gap-3">
                                    <div className="w-full flex h-20 items-center justify-center rounded-2xl bg-secondary dark:bg-slate-800 border border-primary/10">
                                        <p className="text-3xl font-black text-primary">24</p>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                                        Seconds
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Stats Column */}
                        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                            {/* Earnings Card */}
                            <div className="bg-primary text-white rounded-2xl p-8 flex flex-col justify-between shadow-xl shadow-primary/10 relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 opacity-10">
                                    <span className="material-symbols-outlined text-9xl">
                                        payments
                                    </span>
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-xs font-black uppercase tracking-[0.15em] opacity-80">
                                            Earnings (Oct)
                                        </p>
                                        <span className="material-symbols-outlined">trending_up</span>
                                    </div>
                                    <p className="text-4xl font-black">$1,240.00</p>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">
                                            +12.5%
                                        </span>
                                        <span className="text-xs opacity-70">from last month</span>
                                    </div>
                                </div>
                            </div>

                            {/* Rating Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-teal-100 dark:border-slate-800 p-8 flex flex-col justify-between shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                                        Avg Rating
                                    </p>
                                    <span className="material-symbols-outlined text-primary fill-icon">
                                        stars
                                    </span>
                                </div>
                                <div className="flex items-end gap-3">
                                    <p className="text-4xl font-black text-slate-800 dark:text-white">
                                        4.9
                                    </p>
                                    <div className="flex pb-2 gap-0.5">
                                        <span className="material-symbols-outlined text-yellow-400 text-lg fill-icon">
                                            star
                                        </span>
                                        <span className="material-symbols-outlined text-yellow-400 text-lg fill-icon">
                                            star
                                        </span>
                                        <span className="material-symbols-outlined text-yellow-400 text-lg fill-icon">
                                            star
                                        </span>
                                        <span className="material-symbols-outlined text-yellow-400 text-lg fill-icon">
                                            star
                                        </span>
                                        <span className="material-symbols-outlined text-yellow-400 text-lg fill-icon">
                                            star
                                        </span>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-500 mt-4 font-bold">
                                    Verified feedback from 42 students
                                </p>
                            </div>
                        </div>

                        {/* Upcoming Bookings Table */}
                        <div className="col-span-12 bg-white dark:bg-slate-900 rounded-2xl border border-teal-100 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="px-8 py-6 border-b border-teal-100 dark:border-slate-800 flex items-center justify-between">
                                <h3 className="font-bold text-xl text-slate-800 dark:text-white">
                                    Upcoming Bookings
                                </h3>
                                <Link
                                    className="text-primary text-sm font-black hover:opacity-80 underline underline-offset-4"
                                    href="#"
                                >
                                    View Full Schedule
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-secondary/50 dark:bg-slate-800/50 text-[10px] font-black uppercase text-slate-500 dark:text-slate-500 tracking-[0.15em]">
                                        <tr>
                                            <th className="px-8 py-4">Student</th>
                                            <th className="px-8 py-4">Topic</th>
                                            <th className="px-8 py-4">Date</th>
                                            <th className="px-8 py-4">Time</th>
                                            <th className="px-8 py-4">Status</th>
                                            <th className="px-8 py-4"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-teal-100 dark:divide-slate-800">
                                        <tr className="hover:bg-secondary/30 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-10 h-10 rounded-full bg-primary/10 border-2 border-white dark:border-slate-700 bg-cover"
                                                        style={{
                                                            backgroundImage:
                                                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB41yVQdT9L45Un3dcW0LgEObUz6nexk3VCEj9OV1dwVsh4qY6Bz6DxdR-bH7tV-T7ApEYnIzWC8iR8okamDDvdaZO7c3ZhLkRPLRTTzgBmaU8ULvmedLACeBql4do26HNFv-ZcbXQzu7iC-lvgO6uGr3NGJv157Nk7Rv2m58w8QKZ1JttMlw3QwnySUBaWSrYj4e_yaphoaczuNfX0XID3Wm7IAHm4gdXwyDOvpeIyuGvK9WkAz54FI5EhG36ts9i6Q723Boxs5dI")',
                                                        }}
                                                    ></div>
                                                    <span className="font-bold text-slate-800 dark:text-white">
                                                        Sarah Jenkins
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-sm font-medium text-slate-600 dark:text-slate-300">
                                                Ivy League Prep
                                            </td>
                                            <td className="px-8 py-5 text-sm text-slate-500 dark:text-slate-400">
                                                Oct 12, 2023
                                            </td>
                                            <td className="px-8 py-5 text-sm text-slate-500 dark:text-slate-400">
                                                10:00 AM - 11:00 AM
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-[10px] font-black uppercase rounded-lg tracking-widest border border-green-100 dark:border-green-900/30">
                                                    Confirmed
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button className="text-slate-400 hover:text-primary transition-colors">
                                                    <span className="material-symbols-outlined">
                                                        more_horiz
                                                    </span>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-secondary/30 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-10 h-10 rounded-full bg-primary/10 border-2 border-white dark:border-slate-700 bg-cover"
                                                        style={{
                                                            backgroundImage:
                                                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuClr6X0colzL7DcGcNpWlaWMVpuxmtrElZy3FMLPsRcwqUBTe7QH7o8VOc74PbkVcieD2Six1YIj9jHT2Y0b66vEAo5XV4uJaX_qlWU3zL9qm8AZvPVPOM1ACkOStXtHhYx9tj-H4-MSROoKdLmDxiDZ2maDQVyjkTCEgyBnhDlCMXKmDX6GVyHrRCPs3HEeqPURe8fOlHfmwQHLJ-ejX7msUYZvPHyZwKQ6V44fx1rfBwupDP4hZ3f5Hs-QqOJLyQ8zgTC1hq6u8g")',
                                                        }}
                                                    ></div>
                                                    <span className="font-bold text-slate-800 dark:text-white">
                                                        Michael Ross
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-sm font-medium text-slate-600 dark:text-slate-300">
                                                Essay Review
                                            </td>
                                            <td className="px-8 py-5 text-sm text-slate-500 dark:text-slate-400">
                                                Oct 12, 2023
                                            </td>
                                            <td className="px-8 py-5 text-sm text-slate-500 dark:text-slate-400">
                                                02:30 PM - 03:30 PM
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-[10px] font-black uppercase rounded-lg tracking-widest border border-green-100 dark:border-green-900/30">
                                                    Confirmed
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button className="text-slate-400 hover:text-primary transition-colors">
                                                    <span className="material-symbols-outlined">
                                                        more_horiz
                                                    </span>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-secondary/30 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-10 h-10 rounded-full bg-primary/10 border-2 border-white dark:border-slate-700 bg-cover"
                                                        style={{
                                                            backgroundImage:
                                                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAMnhEJq9KBNMli9HaJQU0GI5VZ_PbaL9Y7zAeq5ebgEIL67UOP1Y6AbzkbRLW-vcuNyzAu8wpz8zK1hGOZBjiHoHWpBBd_MWJPZxNGkOnsGyYepiDP0dWajzFMnrzd391ahwrIQFGCf-8xvoBhl18ClS-JygQryXtVlft8j2CLDcdggyKvuU3j2Bs_psEt2xr8SiAYWBacKra4GL1NnJICFTH6cpRy4SQPkKTGDnP4t6nv5gnmnDISUJpAa_0L7YTpL1WCB359kII")',
                                                        }}
                                                    ></div>
                                                    <span className="font-bold text-slate-800 dark:text-white">
                                                        Emily Chen
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-sm font-medium text-slate-600 dark:text-slate-300">
                                                Extracurricular Strategy
                                            </td>
                                            <td className="px-8 py-5 text-sm text-slate-500 dark:text-slate-400">
                                                Oct 13, 2023
                                            </td>
                                            <td className="px-8 py-5 text-sm text-slate-500 dark:text-slate-400">
                                                09:00 AM - 10:00 AM
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase rounded-lg tracking-widest border border-amber-100 dark:border-amber-900/30">
                                                    Tentative
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button className="text-slate-400 hover:text-primary transition-colors">
                                                    <span className="material-symbols-outlined">
                                                        more_horiz
                                                    </span>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
