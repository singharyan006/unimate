"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useUser, useSession } from "@clerk/nextjs";
import { format } from "date-fns";

export default function ConsultantDashboard() {
    const router = useRouter();
    const { user, isLoaded } = useUser();
    const { session } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [nextSession, setNextSession] = useState<any>(null);
    const [allBookings, setAllBookings] = useState<any[]>([]);
    const [stats, setStats] = useState({
        todaySessions: 0,
        totalEarnings: 0,
        rating: 0,
        reviewCount: 0
    });

    // Role Verification
    useEffect(() => {
        if (user && isLoaded) {
            const role = user.unsafeMetadata.role as string;
            if (!role) router.push('/onboarding');
            else if (role !== 'consultant') router.push('/dashboard');
        }
    }, [user, isLoaded, router]);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            const token = await session?.getToken({ template: 'supabase' });
            const supabase = createClient(token);

            // 1. Fetch All Upcoming Bookings
            const { data: bookings, error: bookingsError } = await supabase
                .from('bookings')
                .select(`
                    *,
                    profiles:profiles!bookings_student_id_fkey (
                        full_name,
                        avatar_url
                    )
                `)
                .eq('consultant_id', user.id)
                .gte('scheduled_at', new Date().toISOString())
                .order('scheduled_at', { ascending: true });

            if (bookings) {
                setAllBookings(bookings);
                if (bookings.length > 0) {
                    setNextSession(bookings[0]);
                }
            }

            // 2. Fetch Consultant Profile & Stats
            const { data: profile } = await supabase
                .from('consultants')
                .select('rating, hourly_rate, review_count')
                .eq('id', user.id)
                .single();

            // 3. Calculate Earnings from Completed Sessions
            const { data: completedSessions } = await supabase
                .from('bookings')
                .select('duration_minutes, status')
                .eq('consultant_id', user.id)
                .eq('status', 'completed');

            const hourlyRate = profile?.hourly_rate || 0;
            const totalMinutes = completedSessions?.reduce((acc, curr) => acc + (curr.duration_minutes || 0), 0) || 0;
            const earnings = (totalMinutes / 60) * hourlyRate;

            setStats({
                todaySessions: bookings ? bookings.filter(b => new Date(b.scheduled_at).toDateString() === new Date().toDateString()).length : 0,
                totalEarnings: earnings,
                rating: profile?.rating || 0,
                reviewCount: profile?.review_count || 0
            });
        };

        fetchData();
    }, [user, session]);

    const startSession = async () => {
        if (!nextSession) return;
        setIsLoading(true);
        try {
            // Use existing booking ID or subject as room logic
            const roomName = `unimate-session-${nextSession.id}`;
            const userName = user?.fullName || "Consultant";
            router.push(`/session?room=${roomName}&user=${encodeURIComponent(userName)}`);
        } catch (error) {
            console.error('Error starting session:', error);
            alert('Failed to start session.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl w-full mx-auto">
            <div className="mb-10">
                <h1 className="text-4xl font-black tracking-tight text-slate-800 dark:text-white mb-2">
                    Welcome to UniMate, {user?.firstName || 'Consultant'}!
                </h1>
                <p className="text-lg text-slate-500 dark:text-slate-400">
                    You have {stats.todaySessions} sessions remaining today.
                </p>
            </div>
            <div className="grid grid-cols-12 gap-8">
                {/* Next Session Card */}
                <div className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-teal-100 dark:border-slate-800 p-8 shadow-sm">
                    {nextSession ? (
                        <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                            <div>
                                <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-[11px] font-black uppercase tracking-widest rounded-full mb-4">
                                    NEXT SESSION
                                </span>
                                <h3 className="text-3xl font-bold text-slate-800 dark:text-white">
                                    {nextSession.topic}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 mt-1">
                                    with{" "}
                                    <span className="font-bold text-primary">{nextSession.profiles?.full_name || 'Student'}</span>
                                </p>
                                <p className="text-sm text-slate-400 mt-2">
                                    {format(new Date(nextSession.scheduled_at), "PPP p")}
                                </p>
                            </div>
                            <button
                                onClick={startSession}
                                disabled={isLoading}
                                className="px-8 py-4 bg-primary text-white rounded-xl font-bold shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined">
                                    {isLoading ? 'pending' : 'videocam'}
                                </span>
                                {isLoading ? 'Starting...' : 'Join Video Call'}
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">event_busy</span>
                            <h3 className="text-xl font-bold text-slate-600 dark:text-slate-300">No Upcoming Sessions</h3>
                            <p className="text-slate-400">You have no sessions scheduled for now.</p>
                        </div>
                    )}
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
                                    Total Earnings
                                </p>
                                <span className="material-symbols-outlined">trending_up</span>
                            </div>
                            <p className="text-4xl font-black">₹{stats.totalEarnings.toLocaleString()}</p>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">
                                    Verified
                                </span>
                                <span className="text-xs opacity-70">lifetime earnings</span>
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
                                {stats.rating.toFixed(1)}
                            </p>
                            <div className="flex pb-2 gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={`material-symbols-outlined text-lg ${i < Math.round(stats.rating) ? 'text-yellow-400 fill-icon' : 'text-slate-300'}`}>
                                        star
                                    </span>
                                ))}
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-4 font-bold">
                            Verified feedback from {stats.reviewCount} students
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
                            href="/consultant/schedule"
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
                                {allBookings.length > 0 ? (
                                    allBookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-secondary/30 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-10 h-10 rounded-full bg-primary/10 border-2 border-white dark:border-slate-700 bg-cover"
                                                        style={{
                                                            backgroundImage: `url("${booking.profiles?.avatar_url || ''}")`,
                                                        }}
                                                    ></div>
                                                    <span className="font-bold text-slate-800 dark:text-white">
                                                        {booking.profiles?.full_name || 'Student'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-sm font-medium text-slate-600 dark:text-slate-300">
                                                {booking.topic}
                                            </td>
                                            <td className="px-8 py-5 text-sm text-slate-500 dark:text-slate-400">
                                                {format(new Date(booking.scheduled_at), "MMM d, yyyy")}
                                            </td>
                                            <td className="px-8 py-5 text-sm text-slate-500 dark:text-slate-400">
                                                {format(new Date(booking.scheduled_at), "h:mm a")}
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg tracking-widest border ${booking.status === 'confirmed'
                                                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-900/30'
                                                    : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/30'
                                                    }`}>
                                                    {booking.status}
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
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-12 text-center text-slate-500 dark:text-slate-400">
                                            No upcoming bookings found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
