"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useUser, useAuth } from "@clerk/nextjs";
import { format, isToday, isPast } from "date-fns";
import { useRouter } from "next/navigation";

interface Booking {
    id: string;
    scheduled_at: string;
    duration_minutes: number;
    topic: string;
    status: string;
    profiles: {
        full_name: string | null;
        avatar_url: string | null;
    };
}

export default function SchedulePage() {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [startingSessionId, setStartingSessionId] = useState<string | null>(null);

    // Filter states
    const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');

    useEffect(() => {
        if (!user || (!isLoaded)) return;

        const fetchBookings = async () => {
            setIsLoading(true);

            const execute = async (token: string) => {
                const supabase = createClient(token);
                const { data, error } = await supabase
                    .from('bookings')
                    .select(`
                        *,
                        profiles:profiles!bookings_student_id_fkey (full_name, avatar_url)
                    `)
                    .eq('consultant_id', user.id)
                    .order('scheduled_at', { ascending: true });

                if (error) throw error;
                if (data) setBookings(data);
            };

            try {
                let token = await getToken({ template: "supabase" });
                try {
                    await execute(token!);
                } catch (err: unknown) {
                    const errorObj = err as { code?: string, status?: number };
                    if (errorObj.code === "PGRST303" || errorObj.status === 401 || errorObj.status === 403) {
                        token = await getToken({ template: "supabase", skipCache: true });
                        await execute(token!);
                    } else {
                        throw err;
                    }
                }
            } catch (err: unknown) {
                console.error("Error fetching bookings:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, [user, isLoaded, getToken]);

    const startSession = async (booking: Booking) => {
        setStartingSessionId(booking.id);
        try {
            const roomName = `unimate-session-${booking.id}`;
            const userName = user?.fullName || "Consultant";
            router.push(`/session?room=${roomName}&user=${encodeURIComponent(userName)}`);
        } catch (error) {
            console.error('Error starting session:', error);
            alert('Failed to start session.');
        } finally {
            setStartingSessionId(null);
        }
    };

    const getFilteredBookings = () => {
        const now = new Date();
        if (filter === 'upcoming') {
            return bookings.filter(b => new Date(b.scheduled_at) >= now || b.status === "pending");
        } else if (filter === 'past') {
            return bookings.filter(b => new Date(b.scheduled_at) < now && b.status !== "pending");
        }
        return bookings;
    };

    const displayBookings = getFilteredBookings();

    return (
        <div className="p-8 max-w-7xl w-full mx-auto">
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-800 dark:text-white mb-2">
                        My Schedule
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400">
                        Manage your upcoming sessions and view past bookings.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-teal-100 dark:border-slate-700 w-fit">
                    <button
                        onClick={() => setFilter('upcoming')}
                        className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${filter === 'upcoming' ? 'bg-white dark:bg-slate-900 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setFilter('past')}
                        className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${filter === 'past' ? 'bg-white dark:bg-slate-900 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                    >
                        Past
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${filter === 'all' ? 'bg-white dark:bg-slate-900 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                    >
                        All
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-teal-100 dark:border-slate-800 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center text-slate-400">
                        <span className="material-symbols-outlined text-4xl animate-spin mb-4">progress_activity</span>
                        <p className="font-medium animate-pulse">Loading schedule...</p>
                    </div>
                ) : displayBookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="mb-6 bg-secondary/30 dark:bg-slate-800 p-6 rounded-full border border-teal-50 dark:border-slate-700">
                            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">event_busy</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                            No {filter !== 'all' ? filter : ''} sessions found
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md">
                            When students book time with you, those sessions will appear here in your agenda.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-teal-100 dark:divide-slate-800">
                        {displayBookings.map((booking) => {
                            const bookingDate = new Date(booking.scheduled_at);
                            const isPastSession = isPast(bookingDate) && booking.status !== 'pending';
                            const isNow = isToday(bookingDate);

                            return (
                                <div key={booking.id} className={`p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-12 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/20 ${isNow && filter === 'upcoming' ? 'bg-primary/5 dark:bg-primary/5' : ''}`}>
                                    {/* Date & Time Column */}
                                    <div className="md:w-48 shrink-0 flex flex-row md:flex-col gap-4 md:gap-1 border-b md:border-b-0 border-teal-100 dark:border-slate-800 pb-4 md:pb-0">
                                        <div className="flex flex-col">
                                            <span className="text-2xl font-black text-slate-800 dark:text-white">
                                                {format(bookingDate, "d")}
                                            </span>
                                            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                                                {format(bookingDate, "MMM, EEE")}
                                            </span>
                                        </div>
                                        <div className="h-full md:h-px w-px md:w-full bg-teal-100 dark:bg-slate-800 my-auto md:my-3"></div>
                                        <div className="flex flex-col justify-center">
                                            <span className="text-lg font-bold text-primary flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-sm">schedule</span>
                                                {format(bookingDate, "h:mm a")}
                                            </span>
                                            <span className="text-xs font-semibold text-slate-400">
                                                {booking.duration_minutes} min
                                            </span>
                                        </div>
                                    </div>

                                    {/* Main Booking Details Column */}
                                    <div className="flex-grow flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div className="flex flex-col gap-4">
                                            {/* Status Badge */}
                                            <div>
                                                <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg tracking-widest border ${booking.status === 'confirmed' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900' :
                                                    booking.status === 'completed' ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700' :
                                                        booking.status === 'cancelled' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900' :
                                                            'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </div>

                                            {/* Topic & Student */}
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">
                                                    {booking.topic || "General Discussion"}
                                                </h3>

                                                <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-teal-100 dark:border-slate-800 rounded-full px-1.5 py-1.5 w-fit shadow-sm">
                                                    <div
                                                        className="w-8 h-8 rounded-full bg-primary/10 bg-cover bg-center border border-white dark:border-slate-700"
                                                        style={{
                                                            backgroundImage: `url("${booking.profiles?.avatar_url || ''}")`,
                                                        }}
                                                    ></div>
                                                    <span className="font-semibold text-sm text-slate-700 dark:text-slate-300 pr-4">
                                                        {booking.profiles?.full_name || 'Student'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="w-full md:w-auto mt-2 md:mt-0">
                                            {isPastSession ? (
                                                <button disabled className="w-full md:w-auto px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl font-bold border border-slate-200 dark:border-slate-700 cursor-not-allowed flex items-center justify-center gap-2">
                                                    Session Ended
                                                </button>
                                            ) : booking.status === 'cancelled' ? (
                                                <button disabled className="w-full md:w-auto px-6 py-3 bg-red-50 dark:bg-red-900/10 text-red-400 rounded-xl font-bold border border-red-100 dark:border-red-900/30 cursor-not-allowed">
                                                    Cancelled
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => startSession(booking)}
                                                    disabled={startingSessionId === booking.id}
                                                    className="w-full md:w-auto px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                                >
                                                    <span className="material-symbols-outlined font-normal">
                                                        {startingSessionId === booking.id ? 'pending' : 'videocam'}
                                                    </span>
                                                    {startingSessionId === booking.id ? 'Loading...' : 'Join Call'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
