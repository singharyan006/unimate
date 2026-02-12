"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useUser, useSession } from "@clerk/nextjs";
import { format, addDays, setHours, setMinutes } from "date-fns";

interface BookingModalProps {
    consultant: any;
    onClose: () => void;
    onSuccess: () => void;
}

export function BookingModal({ consultant, onClose, onSuccess }: BookingModalProps) {
    const { user } = useUser();
    const [date, setDate] = useState<Date>(addDays(new Date(), 1)); // Default tomorrow
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const { session } = useSession();

    // Mock time slots
    const timeSlots = [
        "10:00 AM",
        "11:00 AM",
        "2:00 PM",
        "4:00 PM",
        "6:00 PM"
    ];
    const [selectedTime, setSelectedTime] = useState("");

    const handleBook = async () => {
        if (!user || !selectedTime || !topic) return;
        setLoading(true);

        try {
            const token = await session?.getToken({ template: 'supabase' });
            const supabase = createClient(token);

            // Parse time
            const [time, period] = selectedTime.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;

            const scheduledAt = setMinutes(setHours(date, hours), minutes);

            const { error } = await supabase.from('bookings').insert({
                consultant_id: consultant.id,
                student_id: user.id,
                scheduled_at: scheduledAt.toISOString(),
                status: 'confirmed', // Auto-confirm for now
                topic: topic,
                duration_minutes: 60,
                // amount: consultant.hourly_rate // Removed as it's not in the schema anymore or logic changed
            });

            if (error) {
                console.error("Supabase error:", error);
                throw error;
            }

            onSuccess();
        } catch (error: any) {
            console.error("Booking failed", error);
            alert(`Failed to book session: ${error.message || error.error_description || "Unknown error"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                        Book Session with {consultant.profiles.full_name}
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                        <span className="material-icons-outlined">close</span>
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Topic</label>
                        <input
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g. JEE Strategy, Essay Review..."
                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 ring-primary/20"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Date</label>
                        <input
                            type="date"
                            value={format(date, 'yyyy-MM-dd')}
                            onChange={(e) => setDate(new Date(e.target.value))}
                            min={format(new Date(), 'yyyy-MM-dd')}
                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 ring-primary/20"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Time Slot (IST)</label>
                        <div className="grid grid-cols-3 gap-2">
                            {timeSlots.map(slot => (
                                <button
                                    key={slot}
                                    onClick={() => setSelectedTime(slot)}
                                    className={`py-2 px-3 text-sm rounded-lg border transition-all ${selectedTime === slot
                                        ? 'bg-primary text-white border-primary'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                                        }`}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Total</p>
                                <p className="text-xl font-black text-primary">
                                    {consultant.hourly_rate > 0 ? `₹${consultant.hourly_rate}` : "Free"}
                                </p>
                            </div>           </div>
                        <button
                            onClick={handleBook}
                            disabled={!topic || !selectedTime || loading}
                            className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? 'Booking...' : 'Confirm Booking'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
