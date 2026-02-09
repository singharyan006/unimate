"use client";

import { createClient } from "@/lib/supabase";
import { useUser, useSession } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
    const { user, isLoaded } = useUser();
    const { session } = useSession();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                const token = await session?.getToken({ template: 'supabase' });
                const supabase = createClient(token);

                // Fetch joined data: Consultant details + Profile common details
                const { data, error } = await supabase
                    .from('consultants')
                    .select(`
                        *,
                        profiles:id (
                            full_name,
                            avatar_url,
                            email,
                            phone_number
                        )
                    `)
                    .eq('id', user.id)
                    .single();

                if (error) {
                    console.error("Error fetching profile:", error);
                } else {
                    setProfile(data);
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, session]);

    if (!isLoaded || loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 flex-col gap-4">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Profile not found</h2>
                <Link href="/onboarding" className="text-primary hover:underline">Complete Onboarding</Link>
            </div>
        );
    }

    const { profiles, university, major, graduation_year, bio, experience_years, languages, specializations, linkedin_url, college_email } = profile;

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50 dark:bg-slate-900/50">
            {/* Cover Image Section */}
            <div className="h-64 w-full bg-gradient-to-r from-teal-600 to-primary relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 group-hover:opacity-30 transition-opacity duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto w-full px-8 pb-12 -mt-24 relative z-10">
                {/* Profile Header Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-teal-100 dark:border-slate-800 shadow-xl p-8 mb-8 relative overflow-visible">
                    <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
                        {/* Avatar */}
                        <div className="relative -mt-20 md:-mt-24 group">
                            <div
                                className="w-40 h-40 rounded-full bg-cover bg-center border-[6px] border-white dark:border-slate-900 shadow-2xl transition-transform duration-300 group-hover:scale-105"
                                style={{
                                    backgroundImage: `url("${profiles?.avatar_url || user?.imageUrl}")`
                                }}
                            ></div>
                            <div className="absolute bottom-3 right-3 bg-green-500 w-8 h-8 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center shadow-sm" title="Online">
                                <span className="material-symbols-outlined text-[10px] text-white font-bold">check</span>
                            </div>
                        </div>

                        {/* Name & Title */}
                        <div className="flex-1 mb-2">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">
                                    {profiles?.full_name || user?.fullName}
                                </h1>
                                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest rounded-full border border-blue-100 dark:border-blue-900/30 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">verified</span> Verified
                                </span>
                            </div>
                            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">school</span>
                                {major} @ <span className="text-slate-700 dark:text-slate-300 font-bold">{university}</span>
                            </p>

                            <div className="flex flex-wrap gap-6 mt-4 text-sm text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <span className="material-symbols-outlined text-primary">work_history</span>
                                    <span className="font-bold text-slate-700 dark:text-slate-300">{experience_years || 0} Years</span> Experience
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <span className="material-symbols-outlined text-primary">schedule</span>
                                    Usually replies in <span className="font-bold text-slate-700 dark:text-slate-300">1 hr</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mb-2 w-full md:w-auto mt-4 md:mt-0">
                            {linkedin_url && (
                                <a
                                    href={`https://linkedin.com/in/${linkedin_url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0077b5] rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center"
                                    title="LinkedIn Profile"
                                >
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                </a>
                            )}
                            <button className="flex-1 md:flex-none px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 hover:shadow-lg">
                                <span className="material-symbols-outlined text-sm">share</span>
                                Share
                            </button>
                            <Link href="/onboarding" className="flex-1 md:flex-none px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 hover:translate-y-[-2px]">
                                <span className="material-symbols-outlined text-sm">edit</span>
                                Edit Profile
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Detailed Info */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        {/* About Me */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-teal-100 dark:border-slate-800 shadow-sm p-8">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <span className="material-symbols-outlined text-primary text-2xl">person</span>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white">About Me</h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap text-base">
                                {bio || "Tell students about yourself to get more bookings!"}
                            </p>
                            {!bio && (
                                <Link href="/onboarding" className="inline-block mt-4 text-primary text-sm font-bold hover:underline">
                                    + Add Bio
                                </Link>
                            )}
                        </div>

                        {/* Education & Credentials */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-teal-100 dark:border-slate-800 shadow-sm p-8">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <span className="material-symbols-outlined text-primary text-2xl">school</span>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Education & Credentials</h3>
                            </div>

                            <div className="flex flex-col gap-8">
                                <div className="flex gap-5 relative">
                                    <div className="absolute left-[22px] top-12 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-800"></div>
                                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/30 shadow-sm z-10">
                                        <span className="material-symbols-outlined text-2xl">school</span>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-800 dark:text-white">{university}</h4>
                                        <p className="text-primary font-medium">{major}</p>
                                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-500 dark:text-slate-400">
                                            <span className="material-symbols-outlined text-base">location_on</span>
                                            {profile.college_city || 'City not listed'}
                                            <span className="mx-1">•</span>
                                            Classes of {graduation_year}
                                        </div>
                                    </div>
                                </div>

                                {/* Titles / Achievements */}
                                {profile.titles && profile.titles.length > 0 && (
                                    <div className="flex gap-5">
                                        <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-900/30 shadow-sm z-10">
                                            <span className="material-symbols-outlined text-2xl">emoji_events</span>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Achievements</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {profile.titles.map((title: string, idx: number) => (
                                                    <span key={idx} className="px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider rounded-lg border border-amber-100 dark:border-amber-900/30">
                                                        {title}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Stats & Insights */}
                    <div className="flex flex-col gap-8">
                        {/* Expertise Tags */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-teal-100 dark:border-slate-800 shadow-sm p-6">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">psychology</span> Expertise
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {specializations?.map((tag: string) => (
                                    <span key={tag} className="px-3 py-1.5 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 rounded-lg text-xs font-bold border border-teal-100 dark:border-teal-900/30">
                                        {tag}
                                    </span>
                                ))}
                                {!specializations?.length && <span className="text-sm text-slate-400 italic">No expertise added yet.</span>}
                            </div>
                        </div>

                        {/* Languages */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-teal-100 dark:border-slate-800 shadow-sm p-6">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">language</span> Languages
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {languages?.map((lang: string) => (
                                    <span key={lang} className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300">
                                        {lang}
                                    </span>
                                ))}
                                {!languages?.length && <span className="text-sm text-slate-400 italic">No languages added.</span>}
                            </div>
                        </div>

                        {/* Contact Card */}
                        <div className="bg-gradient-to-br from-primary to-teal-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <span className="material-symbols-outlined text-8xl">mail</span>
                            </div>
                            <h3 className="text-lg font-bold mb-2 relative z-10">Contact Info</h3>
                            <div className="flex flex-col gap-3 relative z-10 text-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-sm">mail</span>
                                    </div>
                                    <p className="font-medium opacity-90">{profile.profiles?.email}</p>
                                </div>
                                {profile.profiles?.phone_number && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-sm">call</span>
                                        </div>
                                        <p className="font-medium opacity-90">{profile.profiles?.phone_number}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
