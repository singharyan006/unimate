import Link from "next/link";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-img-element */

export default function StudentDashboard() {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-200">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-background-dark/80 backdrop-blur-md px-6 md:px-10 lg:px-40 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 text-primary">
                            <svg
                                fill="currentColor"
                                viewBox="0 0 100 100"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M50 15L10 35L50 55L90 35L50 15Z"></path>
                                <path d="M20 40V65C20 65 30 75 50 75C70 75 80 65 80 65V40L50 55L20 40Z"></path>
                                <path
                                    d="M15 45C15 45 12 45 12 55C12 65 15 75 15 75"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeWidth="4"
                                ></path>
                                <rect
                                    fill="#e8d5b5"
                                    height="10"
                                    rx="2"
                                    width="6"
                                    x="12"
                                    y="70"
                                ></rect>
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold leading-tight tracking-tight text-primary">
                            UniMate
                        </h2>
                    </div>
                    <div className="flex flex-1 justify-end gap-6 items-center">
                        <nav className="hidden md:flex items-center gap-8">
                            <Link
                                className="text-sm font-semibold hover:text-primary transition-colors text-slate-600 dark:text-slate-300"
                                href="#"
                            >
                                Find Consultants
                            </Link>
                            <Link
                                className="text-sm font-semibold hover:text-primary transition-colors text-slate-600 dark:text-slate-300"
                                href="#"
                            >
                                My Sessions
                            </Link>
                            <Link
                                className="text-sm font-semibold hover:text-primary transition-colors text-slate-600 dark:text-slate-300"
                                href="#"
                            >
                                Messages
                            </Link>
                        </nav>
                        <div className="flex items-center gap-4">
                            <button className="flex items-center justify-center rounded-full h-10 w-10 bg-secondary text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                <span className="material-icons-outlined text-[20px]">
                                    notifications
                                </span>
                            </button>
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-10 w-10 ring-2 ring-primary/20"
                                style={{
                                    backgroundImage:
                                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBsfBElRnXInk8IXrWQOnTB7cqmP1JyvelG-6BoyyiVnWJXbSSi4eo_dTi_-v67EPpWQoyrmFDH73AfpLAF_B6pc0i34C8GppYnIUK8h6iKMAV4JM4LeJQXwMGzSF14MaRiOMA8XnAHbC6xVi-dtAb6E3opLKB6MXNnSzdoIIJBLqIA_E0eVKSQD8bl_zauTzVFQR1bTxbvRAWRzE2MHFrZm2VhAKzOIfNGvQXh5nh19Py5xBsXUjxBB-lbAFU8wKscHoOqC5Qul4Y")',
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 px-4 md:px-10 lg:px-40 py-8">
                <div className="flex flex-col gap-2 mb-8">
                    <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-800 dark:text-white">
                        Welcome back, Alex!
                    </h1>
                    <p className="text-primary font-medium text-lg">
                        Your path to your dream university starts here.
                    </p>
                </div>

                {/* Sessions Section */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[22px] font-bold tracking-tight text-slate-800 dark:text-white">
                            Your Upcoming Sessions
                        </h2>
                        <Link
                            className="text-primary text-sm font-bold hover:underline"
                            href="#"
                        >
                            View All
                        </Link>
                    </div>
                    <div className="flex overflow-x-auto gap-5 pb-4 scrollbar-hide">
                        {/* Session Card 1 */}
                        <div className="flex min-w-[340px] flex-col gap-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 p-5 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-12 h-12 rounded-xl bg-cover bg-center shadow-sm"
                                    style={{
                                        backgroundImage:
                                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDUeGzGrNuwESTH6h2rsWeiSJFqLk_b_2SZCu4Ib84AoAF4ofmJr5yUCaKrw7QAE4Tr2fyJtvOiDuz7mn_A7_zcQz-sF2LnXT4OfU-aAJVJI2TmlYThLxNu84wFGNJAscAVI0x1-PVmgNOyUyHACRGvYKjgBzGxcADfsbEr8KFV_daDmO-HUfvJWrShmSm20xcabFUd1uYS0d2kWD6xJMxsksHKbXNwP6nbiyhEoR5IADAKmTphrGx7O6PVor44wOUiFKZsmTtU5s4')",
                                    }}
                                ></div>
                                <div className="flex flex-col">
                                    <p className="text-base font-bold leading-none text-slate-800 dark:text-white">
                                        Sarah Jenkins
                                    </p>
                                    <p className="text-xs text-primary font-medium mt-1">
                                        Harvard University &apos;23
                                    </p>
                                </div>
                                <div className="ml-auto bg-primary text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                                    Today
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <p className="text-sm font-bold text-slate-800 dark:text-white">
                                    Ivy League Essay Strategy
                                </p>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <span className="material-icons-outlined text-sm text-primary">
                                        schedule
                                    </span>
                                    <p className="text-xs font-medium">4:00 PM - 5:00 PM (EST)</p>
                                </div>
                            </div>
                            <button className="w-full flex cursor-pointer items-center justify-center rounded-xl h-11 px-4 bg-primary text-white text-sm font-bold gap-2 hover:opacity-90 transition-all shadow-sm">
                                <span className="material-icons-outlined text-lg">
                                    video_call
                                </span>
                                <span>Join Video Call</span>
                            </button>
                        </div>
                        {/* Session Card 2 */}
                        <div className="flex min-w-[340px] flex-col gap-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 p-5 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-12 h-12 rounded-xl bg-cover bg-center shadow-sm"
                                    style={{
                                        backgroundImage:
                                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCAawa3qsffmlhuywvginiMxfzWUk1HuI3zv4vzL2ua-sOl4ypRr7dcjphoUzDR8MHHuPs_mujZMR_4OWxtwGS0U6bqfAR-_YstGS-txALcMRTG9bh5FsZECb6Q5mtsWy2tZljoboSAD80wxNLYB6yoJdkNPeyYrusRvDGeHthTO35QI7RhUzX7x2SC3T3OXNQT2mxZ98zHsciV7uBloM0CWV_l4WKPuaVfBifqsJjsy5QA61a0nhBoShGqmbr59Fj2q4Nfjdpmrno')",
                                    }}
                                ></div>
                                <div className="flex flex-col">
                                    <p className="text-base font-bold leading-none text-slate-800 dark:text-white">
                                        Michael Lee
                                    </p>
                                    <p className="text-xs text-primary font-medium mt-1">
                                        Stanford University &apos;24
                                    </p>
                                </div>
                                <div className="ml-auto bg-secondary text-primary text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border border-primary/20">
                                    Tomorrow
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <p className="text-sm font-bold text-slate-800 dark:text-white">
                                    STEM Major Deep Dive
                                </p>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <span className="material-icons-outlined text-sm text-primary">
                                        schedule
                                    </span>
                                    <p className="text-xs font-medium">10:30 AM - 11:30 AM (EST)</p>
                                </div>
                            </div>
                            <button className="w-full flex cursor-pointer items-center justify-center rounded-xl h-11 px-4 bg-secondary text-primary text-sm font-bold gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-primary/10">
                                <span className="material-icons-outlined text-lg">
                                    calendar_today
                                </span>
                                <span>View Details</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Discovery Section */}
                <section className="mt-8">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
                                Discover Consultants
                            </h2>
                            <div className="w-full md:max-w-md">
                                <label className="flex items-center h-12 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition-all shadow-sm">
                                    <span className="material-icons-outlined text-primary mr-2">
                                        search
                                    </span>
                                    <input
                                        className="w-full bg-transparent border-none focus:ring-0 text-sm placeholder:text-slate-400 font-medium outline-none text-slate-900 dark:text-white"
                                        placeholder="Search by university, major, or name..."
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <button className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-bold shadow-md shadow-primary/20">
                                All Specialists
                            </button>
                            <button className="px-5 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 text-sm font-semibold text-slate-600 dark:text-slate-300 transition-all hover:bg-secondary dark:hover:bg-slate-800">
                                Ivy League
                            </button>
                            <button className="px-5 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 text-sm font-semibold text-slate-600 dark:text-slate-300 transition-all hover:bg-secondary dark:hover:bg-slate-800">
                                Public Universities
                            </button>
                            <button className="px-5 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 text-sm font-semibold text-slate-600 dark:text-slate-300 transition-all hover:bg-secondary dark:hover:bg-slate-800">
                                Financial Aid
                            </button>
                            <button className="px-5 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 text-sm font-semibold text-slate-600 dark:text-slate-300 transition-all hover:bg-secondary dark:hover:bg-slate-800">
                                STEM
                            </button>
                            <button className="px-5 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 text-sm font-semibold text-slate-600 dark:text-slate-300 transition-all hover:bg-secondary dark:hover:bg-slate-800">
                                Liberal Arts
                            </button>
                            <button className="flex items-center gap-1 px-5 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 text-sm font-bold text-primary transition-all">
                                <span className="material-icons-outlined text-sm">tune</span>
                                More Filters
                            </button>
                        </div>

                        {/* Consultant Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {/* Consultant 1 */}
                            <div className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                                <div
                                    className="relative h-52 w-full bg-center bg-cover"
                                    style={{
                                        backgroundImage:
                                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA0AXHxUvltCPwwPFBIpIIf0IxBIdZnL-AhZPwEvtOxqGfsqqB_PTccynAonSZJmWCgRMJA5LtIYAaQWqvqsKR7ZxeyIqhKKvtcF9lHtLmFqBT7lJEw_S0XvDFTwBXh1uLkITljsZawuwNsywO8a5WP63CnTDe8B54BX3ABd8XI7pgsn2h-QLTN8o8b5AwDZUWQ5l3suVNBY1Ys6bsMBijaMUoT0y7e01gzIcKQKRCyFoU0bj83hHROi3DATjpYoLx_NOjAw7gR-rc')",
                                    }}
                                >
                                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl px-2.5 py-1 flex items-center gap-1 shadow-sm">
                                        <span className="material-icons-outlined text-yellow-500 text-sm">
                                            star
                                        </span>
                                        <span className="text-xs font-bold text-slate-800 dark:text-white">
                                            4.9
                                        </span>
                                        <span className="text-[10px] text-slate-500">(124)</span>
                                    </div>
                                    <div className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-white p-1.5 shadow-lg ring-2 ring-secondary">
                                        <img
                                            alt="Yale University Logo"
                                            className="w-full h-full object-contain"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvkJa_Kd9GHhBt9zDuCHlX0bmoCcg9j5e4kC1evbxlkEai57GOl3fYLiPNt2y4LE7YZlrcW4c9n92ChA9P-nujz55_TPIq665Gbh_kztEx9LJvmJnm-KBn9nwmmg8DSx77RH6VtvL8ZHk7w6FW67IgGbfo933em3w1Dw0x8iHvWuh0M-1TMNcvOO8eIAvgtHFeqbhhwn_zQZkTcHpaxqc4E4ZthQZmX1lO8esE2MgueGQ5cIE0pzK79jeujpGCfwz6kgQ-lAAzNSM"
                                        />
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-primary transition-colors">
                                            Elena Rodriguez
                                        </h3>
                                        <span className="text-primary font-black text-sm">
                                            From $45/hr
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-primary font-bold mb-3 uppercase tracking-widest">
                                        Yale University • Political Science
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-5 leading-relaxed">
                                        Specializing in personal statements for competitive
                                        humanities programs and scholarship applications.
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        <span className="text-[10px] bg-secondary dark:bg-slate-800 text-primary px-2.5 py-1 rounded-md font-bold">
                                            Scholarships
                                        </span>
                                        <span className="text-[10px] bg-secondary dark:bg-slate-800 text-primary px-2.5 py-1 rounded-md font-bold">
                                            Social Sciences
                                        </span>
                                    </div>
                                    <button className="mt-5 w-full bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold py-2.5 px-4 rounded-xl transition-all text-sm border border-primary/5">
                                        View Profile
                                    </button>
                                </div>
                            </div>
                            {/* Consultant 2 */}
                            <div className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                                <div
                                    className="relative h-52 w-full bg-center bg-cover"
                                    style={{
                                        backgroundImage:
                                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAF9orNxSLaiAmv9Yb7QDNy0yOoQoyUW3sc6I0MpMDNZ0kSY_u1OY8NxQsyvUGwoBz6hQ1DwBu1Qa_mqi-9PIrk3h6mbsk88WpILbPQhC1ATEKxM1dcIyqAs7mq9C3AaBNlbCYzYxsTR49SG10iLuROjyuRsJjfd0ofs3BJz5dHuw1qpefIqhdxSFjpGLQbA8DzDtIPDM_eXCM9KwZIrwC6ja1hD8L86y_7otrqsTtiRlEAOmCDcOU4aUltcIoje2eFKhWuCmvEs7E')",
                                    }}
                                >
                                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl px-2.5 py-1 flex items-center gap-1 shadow-sm">
                                        <span className="material-icons-outlined text-yellow-500 text-sm">
                                            star
                                        </span>
                                        <span className="text-xs font-bold text-slate-800 dark:text-white">
                                            5.0
                                        </span>
                                        <span className="text-[10px] text-slate-500">(89)</span>
                                    </div>
                                    <div className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-white p-1.5 shadow-lg ring-2 ring-secondary">
                                        <img
                                            alt="MIT Logo"
                                            className="w-full h-full object-contain"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaiYdEFENWDXlndfxx9cKBXP4u7nRqgma58R9b3bZ-nBCCtGUnAAzCj1WreErreQT0kosIRpX6ETKO_BpXLdo-RXEgaajAqQmyci77bcDeGgRqUOaizJm4acHuS7q5a4uPbYPrblNcw9f_t-6D4ztPg1ybywYa5soHtDa7G1srgPp7sbphVf8wdXGWPjuLI9lOwOPdkSt-AmlAkXlmLneSYlI5pbx9QVSHEpT8jEqGC6HSd4BR-ZB1j_pqZb8AQmDYUXI2g9KOIcI"
                                        />
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-primary transition-colors">
                                            David Chen
                                        </h3>
                                        <span className="text-primary font-black text-sm">
                                            From $60/hr
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-primary font-bold mb-3 uppercase tracking-widest">
                                        MIT • CS & Robotics
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-5 leading-relaxed">
                                        Focused on portfolio building for engineering majors and
                                        acing technical university interviews.
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        <span className="text-[10px] bg-secondary dark:bg-slate-800 text-primary px-2.5 py-1 rounded-md font-bold">
                                            STEM
                                        </span>
                                        <span className="text-[10px] bg-secondary dark:bg-slate-800 text-primary px-2.5 py-1 rounded-md font-bold">
                                            Portfolios
                                        </span>
                                    </div>
                                    <button className="mt-5 w-full bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold py-2.5 px-4 rounded-xl transition-all text-sm border border-primary/5">
                                        View Profile
                                    </button>
                                </div>
                            </div>
                            {/* Consultant 3 */}
                            <div className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                                <div
                                    className="relative h-52 w-full bg-center bg-cover"
                                    style={{
                                        backgroundImage:
                                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA9FqYgb-XdDf05iro8S2yOxKFEa--FsmVlh_o7IceK5MuWHZYIvlWe_05VVBAPGV6GWbjN0kMbaOWvSsnt1oku_OzQshBqsQOyBgtKc-7zfbq_p6Fry0ouy7eP8sfAVIuHkGm3khjYeikBppC8cVsVBhrUW3Pq9sDmrCuEBDMvC6C7tOK07_N0uHMG5C7RT26uxHPRaSllDqvqdeaYNKQLZ52Q_OEd024nwGWQbTgdxuUQJpkbapEzyPJ7mwW9WWqn6dbyxItFOWg')",
                                    }}
                                >
                                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl px-2.5 py-1 flex items-center gap-1 shadow-sm">
                                        <span className="material-icons-outlined text-yellow-500 text-sm">
                                            star
                                        </span>
                                        <span className="text-xs font-bold text-slate-800 dark:text-white">
                                            4.8
                                        </span>
                                        <span className="text-[10px] text-slate-500">(210)</span>
                                    </div>
                                    <div className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-white p-1.5 shadow-lg ring-2 ring-secondary">
                                        <img
                                            alt="UCLA Logo"
                                            className="w-full h-full object-contain"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrJaoUL1rhkjJ78HUcDquIPt_C9U7Nh9lmS_YjdYuD6vR0g-zqO1HR3I1_vTMRRyWvECR0mOUTnJqikYBfsIPWoRcUXNPKjlo-VRL0bEvhXZNb_9Ff6PKMIDdbGUs30DFrkV1otquYMACBZiSGUoBLKQ4UXR22cFJ7AlHgxEwxWFmviLi0fTDK3jLkmP94pX_e7XR49b00-Z7VkbfsgutoeD1LLakwGCM4opWOcYN91EXQtQ-HHBbWkeI_7Jxe4A8J1IOkqvgi-tQ"
                                        />
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-primary transition-colors">
                                            Sophia Williams
                                        </h3>
                                        <span className="text-primary font-black text-sm">
                                            From $35/hr
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-primary font-bold mb-3 uppercase tracking-widest">
                                        UCLA • Public Policy
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-5 leading-relaxed">
                                        Navigating the UC system applications and maximizing
                                        financial aid opportunities.
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        <span className="text-[10px] bg-secondary dark:bg-slate-800 text-primary px-2.5 py-1 rounded-md font-bold">
                                            Public Uni
                                        </span>
                                        <span className="text-[10px] bg-secondary dark:bg-slate-800 text-primary px-2.5 py-1 rounded-md font-bold">
                                            FAFSA
                                        </span>
                                    </div>
                                    <button className="mt-5 w-full bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold py-2.5 px-4 rounded-xl transition-all text-sm border border-primary/5">
                                        View Profile
                                    </button>
                                </div>
                            </div>
                            {/* Consultant 4 */}
                            <div className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                                <div
                                    className="relative h-52 w-full bg-center bg-cover"
                                    style={{
                                        backgroundImage:
                                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuANg465voBj0lBVrajDDNTOx34VH_SoqBJGEe6ck97RsZOsqv5itz7RnJfFgFeXMk-f9uBbgQLWWyddLvhcTH_P2IUg3boQtuqlHt-H5EcHTEQFYQN6fbQA9D8ueVcrpro88mrt5HsCs4uQ0zexVhWjtC0VKSNO88VUzlre68B2CAJlGBKm17a5byz97GvaEDsZXvwheslKfitJvx7nzXeuINT1lHjdCTD7Pllh8-V9-fPjFEJcH6gPLKqUTz1raYD67MxDCwYurDI')",
                                    }}
                                >
                                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl px-2.5 py-1 flex items-center gap-1 shadow-sm">
                                        <span className="material-icons-outlined text-yellow-500 text-sm">
                                            star
                                        </span>
                                        <span className="text-xs font-bold text-slate-800 dark:text-white">
                                            4.7
                                        </span>
                                        <span className="text-[10px] text-slate-500">(56)</span>
                                    </div>
                                    <div className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-white p-1.5 shadow-lg ring-2 ring-secondary">
                                        <img
                                            alt="UChicago Logo"
                                            className="w-full h-full object-contain"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbkiCoiPChUHBEAAYyTybkZ3FbeY1a-H81ufR6xD_SIGuVwqre79pglq_QDqp7bqDQTWk0BdE_DaF86P9XyOk7DWk2fyQRa2w04qPl62EUnmWCfVn6uIblTki8j84deY1jt3ZQ4mQy8z83SVVpxaaC2gFF7LLvk6OlPAkLN6jOP7MGnhoFfCdW-eoV2maEm3V2PgDSOgsRJvQ0qcBDAFcL4nLnxs1XG0qVfFwI_TMcw4o5xEuV69pJXjmqf1DsCPhJ6BueMdfYjv0"
                                        />
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-primary transition-colors">
                                            Marcus Thorne
                                        </h3>
                                        <span className="text-primary font-black text-sm">
                                            From $50/hr
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-primary font-bold mb-3 uppercase tracking-widest">
                                        UChicago • Economics
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-5 leading-relaxed">
                                        Mastering the &quot;Why UChicago&quot; essay and navigating elite
                                        business program admissions.
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        <span className="text-[10px] bg-secondary dark:bg-slate-800 text-primary px-2.5 py-1 rounded-md font-bold">
                                            Business
                                        </span>
                                        <span className="text-[10px] bg-secondary dark:bg-slate-800 text-primary px-2.5 py-1 rounded-md font-bold">
                                            Economics
                                        </span>
                                    </div>
                                    <button className="mt-5 w-full bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold py-2.5 px-4 rounded-xl transition-all text-sm border border-primary/5">
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center mt-10 pb-12">
                            <button className="flex items-center gap-2 px-10 py-3.5 bg-white dark:bg-slate-900 border border-primary/20 dark:border-slate-800 rounded-2xl font-bold text-primary hover:bg-secondary transition-all shadow-sm">
                                Show More Experts
                                <span className="material-icons-outlined">expand_more</span>
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Floating Chat Button */}
            <div className="fixed bottom-8 right-8 z-40">
                <button className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white shadow-2xl hover:scale-110 active:scale-95 transition-all">
                    <span className="material-icons-outlined text-[32px]">
                        chat_bubble
                    </span>
                </button>
            </div>
        </div>
    );
}
