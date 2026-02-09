"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { useUser, useSession } from "@clerk/nextjs";
import { BookingModal } from "@/components/booking-modal";
import { SuccessModal } from "@/components/success-modal";
import { format } from "date-fns";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-img-element */

export default function StudentDashboard() {
    const router = useRouter();
    const { user, isLoaded } = useUser();
    const { session } = useSession();
    const [loadingSession, setLoadingSession] = useState(false);
    const [consultants, setConsultants] = useState<any[]>([]);
    const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [selectedConsultant, setSelectedConsultant] = useState<any>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    // Role Verification
    useEffect(() => {
        if (user && isLoaded) {
            const role = user.unsafeMetadata.role as string;
            if (!role) router.push('/onboarding');
            else if (role !== 'student') router.push('/consultant');
        }
    }, [user, isLoaded, router]);

    const fetchConsultants = useCallback(async () => {
        const token = await session?.getToken({ template: 'supabase' });
        const supabase = createClient(token);
        const { data, error } = await supabase
            .from('consultants')
            .select(`
                *,
                profiles:id (
                    full_name,
                    avatar_url
                )
            `);

        if (error) {
            console.error('Error fetching consultants:', error);
        } else {
            console.log('Fetched consultants:', data);
            setConsultants(data || []);
        }
    }, [session]);

    const fetchUpcomingSessions = useCallback(async () => {
        if (!user) return;
        const token = await session?.getToken({ template: 'supabase' });
        const supabase = createClient(token);
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                *,
                consultants (
                    profiles (
                        full_name,
                        avatar_url,
                        role
                    ),
                    university,
                    major
                )
            `)
            .eq('student_id', user.id)
            .gte('scheduled_at', new Date().toISOString())
            .order('scheduled_at', { ascending: true });

        if (error) console.error('Error fetching sessions:', error);
        else setUpcomingSessions(data || []);
    }, [user, session]);

    useEffect(() => {
        fetchConsultants();
        fetchUpcomingSessions();
    }, [fetchConsultants, fetchUpcomingSessions]);

    const joinSession = async (session: any) => {
        setLoadingSession(true);
        try {
            // Use session ID for room
            const roomName = `unimate-session-${session.id}`;
            const userName = user?.fullName || "Student User";
            router.push(`/session?room=${roomName}&user=${encodeURIComponent(userName)}`);
        } catch (error) {
            console.error('Error joining session:', error);
            alert('Failed to join session.');
        } finally {
            setLoadingSession(false);
        }
    };

    const filteredConsultants = consultants.filter((consultant) => {
        const matchesSearch =
            consultant.profiles?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            consultant.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
            consultant.major.toLowerCase().includes(searchQuery.toLowerCase());

        const isIIT = consultant.university.includes("IIT") || consultant.university.includes("Indian Institute of Technology");
        const isNIT = consultant.university.includes("NIT") || consultant.university.includes("National Institute of Technology");
        const isBITS = consultant.university.includes("BITS") || consultant.university.includes("Pilani");
        const isDU = consultant.university.includes("Delhi University") || consultant.university.includes("DU");

        const matchesFilter =
            selectedFilter === "All" ||
            consultant.specializations?.includes(selectedFilter) ||
            (selectedFilter === "IITs" && isIIT) ||
            (selectedFilter === "NITs" && isNIT) ||
            (selectedFilter === "BITS" && isBITS) ||
            (selectedFilter === "Delhi University" && isDU);

        return matchesSearch && matchesFilter;
    });

    const filters = [
        "All",
        "IITs",
        "NITs",
        "BITS",
        "Delhi University",
        "Tier 1 Private",
        "Engineering",
        "Medical"
    ];

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-200">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-background-dark/80 backdrop-blur-md px-6 md:px-10 lg:px-40 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 flex items-center justify-center text-primary">
                                <svg
                                    className="w-full h-full"
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
                    </div>
                    <div className="flex flex-1 justify-end gap-6 items-center">
                        <nav className="hidden md:flex items-center gap-8">

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
                        Welcome back, {user?.firstName || "Student"}!
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
                        {upcomingSessions.length > 0 ? (
                            upcomingSessions.map((session) => (
                                <div key={session.id} className="flex min-w-[340px] flex-col gap-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 p-5 transition-all hover:shadow-md">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-12 h-12 rounded-xl bg-cover bg-center shadow-sm"
                                            style={{
                                                backgroundImage: `url('${session.consultants?.profiles?.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuDUeGzGrNuwESTH6h2rsWeiSJFqLk_b_2SZCu4Ib84AoAF4ofmJr5yUCaKrw7QAE4Tr2fyJtvOiDuz7mn_A7_zcQz-sF2LnXT4OfU-aAJVJI2TmlYThLxNu84wFGNJAscAVI0x1-PVmgNOyUyHACRGvYKjgBzGxcADfsbEr8KFV_daDmO-HUfvJWrShmSm20xcabFUd1uYS0d2kWD6xJMxsksHKbXNwP6nbiyhEoR5IADAKmTphrGx7O6PVor44wOUiFKZsmTtU5s4"}')`,
                                            }}
                                        ></div>
                                        <div className="flex flex-col">
                                            <p className="text-base font-bold leading-none text-slate-800 dark:text-white">
                                                {session.consultants?.profiles?.full_name || "Consultant"}
                                            </p>
                                            <p className="text-xs text-primary font-medium mt-1">
                                                {session.consultants?.university}
                                            </p>
                                        </div>
                                        <div className="ml-auto bg-primary text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                                            {new Date(session.scheduled_at).toDateString() === new Date().toDateString() ? "Today" : "Upcoming"}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <p className="text-sm font-bold text-slate-800 dark:text-white">
                                            {session.topic}
                                        </p>
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <span className="material-icons-outlined text-sm text-primary">
                                                schedule
                                            </span>
                                            <p className="text-xs font-medium">
                                                {format(new Date(session.scheduled_at), "h:mm a")} - {format(new Date(new Date(session.scheduled_at).getTime() + session.duration_minutes * 60000), "h:mm a")}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => joinSession(session)}
                                        disabled={loadingSession}
                                        className="w-full flex cursor-pointer items-center justify-center rounded-xl h-11 px-4 bg-primary text-white text-sm font-bold gap-2 hover:opacity-90 transition-all shadow-sm disabled:opacity-50"
                                    >
                                        <span className="material-icons-outlined text-lg">
                                            {loadingSession ? 'pending' : 'video_call'}
                                        </span>
                                        <span>{loadingSession ? 'Joining...' : 'Join Video Call'}</span>
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="w-full flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                                <span className="material-icons-outlined text-4xl text-slate-400 mb-2">event_busy</span>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No upcoming sessions</p>
                                <p className="text-xs text-slate-400 mt-1">Book a mentor below to get started.</p>
                            </div>
                        )}
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
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            {filters.map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setSelectedFilter(filter)}
                                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${selectedFilter === filter
                                        ? "bg-primary text-white shadow-md shadow-primary/20"
                                        : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 text-slate-600 dark:text-slate-300 hover:bg-secondary dark:hover:bg-slate-800"
                                        }`}
                                >
                                    {filter === "All" ? "All Specialists" : filter}
                                </button>
                            ))}
                            <button className="flex items-center gap-1 px-5 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 text-sm font-bold text-primary transition-all">
                                <span className="material-icons-outlined text-sm">tune</span>
                                More Filters
                            </button>
                        </div>

                        {/* Consultant Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredConsultants.map((consultant) => (
                                <div key={consultant.id} className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                                    <div
                                        className="relative h-52 w-full bg-center bg-cover"
                                        style={{
                                            backgroundImage: `url('${consultant.profiles?.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUeGzGrNuwESTH6h2rsWeiSJFqLk_b_2SZCu4Ib84AoAF4ofmJr5yUCaKrw7QAE4Tr2fyJtvOiDuz7mn_A7_zcQz-sF2LnXT4OfU-aAJVJI2TmlYThLxNu84wFGNJAscAVI0x1-PVmgNOyUyHACRGvYKjgBzGxcADfsbEr8KFV_daDmO-HUfvJWrShmSm20xcabFUd1uYS0d2kWD6xJMxsksHKbXNwP6nbiyhEoR5IADAKmTphrGx7O6PVor44wOUiFKZsmTtU5s4'}')`,
                                        }}
                                    >
                                        <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl px-2.5 py-1 flex items-center gap-1 shadow-sm">
                                            <span className="material-icons-outlined text-yellow-500 text-sm">
                                                star
                                            </span>
                                            <span className="text-xs font-bold text-slate-800 dark:text-white">
                                                {consultant.rating}
                                            </span>
                                            <span className="text-[10px] text-slate-500">({consultant.review_count})</span>
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-primary transition-colors">
                                                {consultant.profiles?.full_name}
                                            </h3>
                                            <span className="text-primary font-black text-sm">
                                                From ₹{consultant.hourly_rate}/hr
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-primary font-bold mb-3 uppercase tracking-widest">
                                            {consultant.university} • {consultant.major}
                                        </p>
                                        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-5 leading-relaxed">
                                            {consultant.bio}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-auto">
                                            {consultant.specializations?.map((tag: string, index: number) => (
                                                <span key={index} className="text-[10px] bg-secondary dark:bg-slate-800 text-primary px-2.5 py-1 rounded-md font-bold">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => setSelectedConsultant(consultant)}
                                            className="mt-5 w-full bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold py-2.5 px-4 rounded-xl transition-all text-sm border border-primary/5"
                                        >
                                            Book Session
                                        </button>
                                    </div>
                                </div>
                            ))}
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

            {/* Modals */}
            {selectedConsultant && (
                <BookingModal
                    consultant={selectedConsultant}
                    onClose={() => setSelectedConsultant(null)}
                    onSuccess={() => {
                        setSelectedConsultant(null);
                        setShowSuccess(true);
                        fetchUpcomingSessions();
                    }}
                />
            )}

            {showSuccess && (
                <SuccessModal
                    consultantName={selectedConsultant?.profiles?.full_name || "the consultant"}
                    onClose={() => setShowSuccess(false)}
                />
            )}

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
