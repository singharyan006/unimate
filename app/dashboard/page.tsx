"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase";
import { useUser, useAuth, useClerk } from "@clerk/nextjs";
import { BookingModal } from "@/components/booking-modal";
import { SuccessModal } from "@/components/success-modal";
import { format } from "date-fns";
import Image from "next/image";

import { RequestCollegeModal } from '@/components/student/RequestCollegeModal';

interface Consultant {
    id: string;
    profiles?: {
        full_name: string | null;
        avatar_url: string | null;
    };
    university: string;
    major: string;
    rating: number;
    review_count: number;
    hourly_rate: number;
    bio: string;
    specializations: string[];
}

interface DashboardBooking {
    id: string;
    topic: string;
    scheduled_at: string;
    duration_minutes: number;
    consultants: {
        profiles: {
            full_name: string | null;
            avatar_url: string | null;
            role: string | null;
        };
        university: string;
        major: string;
    } | null;
}

export default function StudentDashboard() {
    const router = useRouter();
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const [loadingSession, setLoadingSession] = useState(false);
    const [consultants, setConsultants] = useState<Consultant[]>([]);
    const [upcomingSessions, setUpcomingSessions] = useState<DashboardBooking[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [hasUnread, setHasUnread] = useState(true);
    const notifRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const { signOut } = useClerk();

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfileMenu(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Role Verification
    useEffect(() => {
        if (user && isLoaded) {
            const role = user.unsafeMetadata.role as string;
            if (!role) router.push('/onboarding');
            else if (role !== 'student') router.push('/consultant');
        }
    }, [user, isLoaded, router]);

    const fetchConsultants = useCallback(async () => {
        const execute = async (token: string) => {
            const supabase = createClient(token);
            const { data, error } = await supabase
                .from('consultants')
                .select(`
                    *,
                    profiles:profiles!consultants_id_fkey (full_name, avatar_url)
                `);

            if (error) throw error;
            setConsultants(data || []);
        };

        try {
            let token = await getToken({ template: 'supabase' });
            try {
                await execute(token!);
            } catch (err: unknown) {
                const supabaseError = err as { code?: string; status?: number };
                if (supabaseError.code === "PGRST303" || supabaseError.status === 401 || supabaseError.status === 403) {
                    token = await getToken({ template: 'supabase', skipCache: true });
                    await execute(token!);
                } else {
                    throw err;
                }
            }
        } catch (err: unknown) {
            console.error('Error fetching consultants:', err);
        }
    }, [getToken]);

    const fetchUpcomingSessions = useCallback(async () => {
        if (!user) return;

        const execute = async (token: string) => {
            const supabase = createClient(token);
            const { data, error } = await supabase
                .from('bookings')
                .select(`
                    *,
                    consultants (
                        profiles (full_name, avatar_url, role),
                        university,
                        major
                    )
                `)
                .eq('student_id', user.id)
                .gte('scheduled_at', new Date().toISOString())
                .order('scheduled_at', { ascending: true });

            if (error) throw error;
            setUpcomingSessions(data || []);
        };

        try {
            let token = await getToken({ template: 'supabase' });
            try {
                await execute(token!);
            } catch (err: unknown) {
                const supabaseError = err as { code?: string; status?: number };
                if (supabaseError.code === "PGRST303" || supabaseError.status === 401 || supabaseError.status === 403) {
                    token = await getToken({ template: 'supabase', skipCache: true });
                    await execute(token!);
                } else {
                    throw err;
                }
            }
        } catch (err) {
            console.error('Error fetching sessions:', err);
        }
    }, [user, getToken]);

    useEffect(() => {
        fetchConsultants();
        fetchUpcomingSessions();
    }, [fetchConsultants, fetchUpcomingSessions]);

    const joinSession = async (sessionData: DashboardBooking) => {
        setLoadingSession(true);
        try {
            // Use session ID for room
            const roomName = `unimate-session-${sessionData.id}`;
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
            (consultant.profiles?.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (consultant.university || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (consultant.major || "").toLowerCase().includes(searchQuery.toLowerCase());

        const isIIT = (consultant.university || "").includes("IIT") || (consultant.university || "").includes("Indian Institute of Technology");
        const isNIT = (consultant.university || "").includes("NIT") || (consultant.university || "").includes("National Institute of Technology");
        const isBITS = (consultant.university || "").includes("BITS") || (consultant.university || "").includes("Pilani");
        const isDU = (consultant.university || "").includes("Delhi University") || (consultant.university || "").includes("DU");

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
        "Engineering",
        "Medical"
    ];

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-200">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-background-dark/80 backdrop-blur-md px-6 md:px-10 lg:px-40 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-80">
                            <Image
                                src="/unimate.png"
                                alt="UniMate"
                                width={36}
                                height={36}
                                className="rounded-full object-cover"
                            />
                            <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">UniMate</h2>
                        </Link>
                    </div>
                    <div className="flex flex-1 justify-end gap-6 items-center">
                        <nav className="hidden md:flex items-center gap-8">
                            <button
                                onClick={() => setIsRequestModalOpen(true)}
                                className="h-10 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors whitespace-nowrap border border-slate-200 dark:border-slate-700"
                            >
                                + Request College
                            </button>
                        </nav>
                        <div className="flex items-center gap-3">

                            {/* Notification Bell */}
                            <div className="relative" ref={notifRef}>
                                <button
                                    onClick={() => { setShowNotifications(v => !v); setShowProfileMenu(false); }}
                                    className="relative flex items-center justify-center rounded-full h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <span className="material-icons-outlined text-[20px]">notifications</span>
                                    {/* Unread dot — only shown when there are unread notifs */}
                                    {hasUnread && (
                                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
                                    )}
                                </button>

                                {showNotifications && (
                                    <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden">
                                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                                            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Notifications</h3>
                                            {hasUnread && (
                                                <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">1 new</span>
                                            )}
                                        </div>
                                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                            <div className="flex items-start gap-3 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                                    <span className="material-icons-outlined text-primary text-sm">campaign</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-slate-800 dark:text-white">Welcome to UniMate! 🎉</p>
                                                    <p className="text-xs text-slate-500 mt-0.5">Explore consultants and book your first session.</p>
                                                    <p className="text-[10px] text-slate-400 mt-1">Just now</p>
                                                </div>
                                                {/* Per-notification unread dot */}
                                                {hasUnread && (
                                                    <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1.5" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 text-center">
                                            {hasUnread ? (
                                                <button
                                                    onClick={() => setHasUnread(false)}
                                                    className="text-xs text-primary font-bold hover:underline"
                                                >
                                                    Mark all as read
                                                </button>
                                            ) : (
                                                <span className="text-xs text-slate-400">All caught up ✓</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Profile Avatar */}
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => { setShowProfileMenu(v => !v); setShowNotifications(false); }}
                                    className="relative rounded-full h-10 w-10 ring-2 ring-primary/30 hover:ring-primary/60 transition-all overflow-hidden"
                                >
                                    <Image
                                        src={user?.imageUrl || "https://api.dicebear.com/9.x/notionists/svg?seed=student"}
                                        alt="Profile"
                                        fill
                                        className="object-cover"
                                    />
                                </button>

                                {showProfileMenu && (
                                    <div className="absolute right-0 top-12 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden py-1">
                                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                                            <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.fullName || "Student"}</p>
                                            <p className="text-xs text-slate-500 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                                        </div>
                                        <div className="py-1">
                                            <Link
                                                href="/dashboard/profile"
                                                onClick={() => setShowProfileMenu(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                            >
                                                <span className="material-icons-outlined text-base text-slate-400">person</span>
                                                My Profile
                                            </Link>
                                            <Link
                                                href="/dashboard"
                                                onClick={() => setShowProfileMenu(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                            >
                                                <span className="material-icons-outlined text-base text-slate-400">dashboard</span>
                                                Dashboard
                                            </Link>
                                        </div>
                                        <div className="border-t border-slate-100 dark:border-slate-800 py-1">
                                            <button
                                                onClick={() => signOut({ redirectUrl: "/" })}
                                                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            >
                                                <span className="material-icons-outlined text-base">logout</span>
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
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
                                                {session.consultants?.university || "University"}
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

                        {/* Consultant Grid — shows first 4 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredConsultants.slice(0, 4).map((consultant) => (
                                <div key={consultant.id} className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                                    <div
                                        className="relative h-52 w-full bg-center bg-cover"
                                        style={{
                                            backgroundImage: `url('${consultant.profiles?.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUeGzGrNuwESTH6h2rsWeiSJFqLk_b_2SZCu4Ib84AoAF4ofmJr5yUCaKrw7QAE4Tr2fyJtvOiDuz7mn_A7_zcQz-sF2LnXT4OfU-aAJVJI2TmlYThLxNu84wFGNJAscAVI0x1-PVmgNOyUyHACRGvYKjgBzGxcADfsbEr8KFV_daDmO-HUfvJWrShmSm20xcabFUd1uYS0d2kWD6xJMxsksHKbXNwP6nbiyhEoR5IADAKmTphrGx7O6PVor44wOUiFKZsmTtU5s4'}')`,
                                        }}
                                    >
                                        <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl px-2.5 py-1 flex items-center gap-1 shadow-sm">
                                            <span className="material-icons-outlined text-yellow-500 text-sm">star</span>
                                            <span className="text-xs font-bold text-slate-800 dark:text-white">{consultant.rating}</span>
                                            <span className="text-[10px] text-slate-500">({consultant.review_count})</span>
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="mb-2">
                                            <h3 className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-primary transition-colors">
                                                {consultant.profiles?.full_name || "Consultant"}
                                            </h3>
                                        </div>
                                        <p className="text-[11px] text-primary font-bold mb-3 uppercase tracking-widest">
                                            {consultant.university || "University"} • {consultant.major || "Major"}
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
                            <Link
                                href="/dashboard/consultants"
                                className="flex items-center gap-2 px-10 py-3.5 bg-white dark:bg-slate-900 border border-primary/20 dark:border-slate-800 rounded-2xl font-bold text-primary hover:bg-secondary dark:hover:bg-slate-800 transition-all shadow-sm"
                            >
                                Show More Experts
                                <span className="material-icons-outlined">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Modals */}
            <RequestCollegeModal
                isOpen={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
            />
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


        </div>
    );
}
