"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ConsultantDetailsModal } from "@/components/consultant-details-modal";

const FILTERS = ["All", "IITs", "NITs", "BITS", "Delhi University"];
const FALLBACK_AVATAR = "https://api.dicebear.com/9.x/notionists/svg?seed=Felix&backgroundColor=e0f2fe";

interface Consultant {
    id: string;
    profiles?: {
        full_name: string | null;
        avatar_url: string | null;
    } | null;
    university: string | null;
    major: string | null;
    rating: number | null;
    review_count: number | null;
    bio: string | null;
    specializations: string[] | null;
    github_url: string | null;
    linkedin_url: string | null;
    college_email: string | null;
    hourly_rate: number | null;
    graduation_year: string | null;
}

export default function ConsultantNetworkPage() {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const router = useRouter();

    const [consultants, setConsultants] = useState<Consultant[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);

    // Role check
    useEffect(() => {
        if (isLoaded && user) {
            const role = user.unsafeMetadata.role as string;
            if (!role) router.push("/onboarding");
            else if (role !== "consultant") router.push("/dashboard");
        }
    }, [user, isLoaded, router]);

    const fetchConsultants = useCallback(async () => {
        if (!getToken) return;
        setLoading(true);

        const execute = async (token: string) => {
            const supabase = createClient(token);
            const { data, error } = await supabase
                .from("consultants")
                .select(`
                    id, university, major, rating, review_count, bio, specializations, github_url, linkedin_url, college_email, hourly_rate, graduation_year,
                    profiles:profiles!consultants_id_fkey (full_name, avatar_url)
                `);

            if (error) throw error;
            // Exclude current user from network grid
            const peers = (data || []).filter(c => c.id !== user?.id) as unknown as Consultant[];
            setConsultants(peers);
        };

        try {
            let token = await getToken({ template: "supabase" });
            try {
                await execute(token!);
            } catch (err: unknown) {
                const supabaseError = err as { code?: string; status?: number };
                if (supabaseError.code === "PGRST303" || supabaseError.status === 401 || supabaseError.status === 403) {
                    token = await getToken({ template: "supabase", skipCache: true });
                    await execute(token!);
                } else {
                    throw err;
                }
            }
        } catch (err: unknown) {
            console.error("Error fetching network:", err);
        } finally {
            setLoading(false);
        }
    }, [getToken, user?.id]);

    useEffect(() => { fetchConsultants(); }, [fetchConsultants]);

    const filtered = consultants.filter((c) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
            (c.profiles?.full_name || "").toLowerCase().includes(q) ||
            (c.university || "").toLowerCase().includes(q) ||
            (c.major || "").toLowerCase().includes(q) ||
            (c.bio || "").toLowerCase().includes(q);

        const isIIT = (c.university || "").includes("IIT");
        const isNIT = (c.university || "").includes("NIT");
        const isBITS = (c.university || "").includes("BITS");
        const isDU = (c.university || "").includes("Delhi University");

        const matchesFilter =
            selectedFilter === "All" ||
            c.specializations?.includes(selectedFilter) ||
            (selectedFilter === "IITs" && isIIT) ||
            (selectedFilter === "NITs" && isNIT) ||
            (selectedFilter === "BITS" && isBITS) ||
            (selectedFilter === "Delhi University" && isDU);

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="p-8 max-w-7xl w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-black tracking-tight text-slate-800 dark:text-white mb-2">
                    Consultant Network
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-base">
                    Discover and connect with fellow mentors and experts on UniMate.
                </p>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col gap-5 mb-8">
                <label className="flex items-center h-14 w-full max-w-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl px-5 focus-within:ring-4 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm">
                    <span className="material-symbols-outlined text-primary text-xl mr-3 font-bold">search</span>
                    <input
                        className="flex-1 bg-transparent border-none focus:ring-0 text-[15px] placeholder:text-slate-400 font-bold outline-none text-slate-900 dark:text-white"
                        placeholder="Search by name, university, major..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    )}
                </label>

                <div className="flex flex-wrap gap-2.5">
                    {FILTERS.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setSelectedFilter(filter)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedFilter === filter
                                ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 text-slate-600 dark:text-slate-300 shadow-sm"
                                }`}
                        >
                            {filter === "All" ? "All Network" : filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Result Count */}
            {!loading && (
                <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-slate-800 dark:text-white">{filtered.length}</span> peers found
                    {selectedFilter !== "All" && <span>in <span className="text-primary">{selectedFilter}</span></span>}
                </p>
            )}

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden animate-pulse">
                            <div className="h-48 bg-slate-100 dark:bg-slate-800/50" />
                            <div className="p-6 flex flex-col gap-4">
                                <div className="h-5 bg-slate-100 dark:bg-slate-800/80 rounded-full w-3/4" />
                                <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded-full w-1/2" />
                                <div className="h-3 bg-slate-100 dark:bg-slate-800/40 rounded-full w-full" />
                                <div className="h-12 bg-slate-100 dark:bg-slate-800/50 rounded-xl mt-2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center gap-5 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
                    <div className="w-20 h-20 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-slate-400">group_off</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-1">No peers found</h3>
                        <p className="text-slate-500 font-medium text-sm max-w-xs mx-auto">Try adjusting your filters or search terms.</p>
                    </div>
                    <button onClick={() => { setSearchQuery(""); setSelectedFilter("All"); }}
                        className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filtered.map((consultant) => (
                        <div
                            key={consultant.id}
                            onClick={() => setSelectedConsultant(consultant)}
                            className="group flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all hover:-translate-y-1 cursor-pointer"
                        >
                            <div
                                className="relative h-48 w-full bg-center bg-cover border-b-4 border-primary/20"
                                style={{ backgroundImage: `url('${consultant.profiles?.avatar_url || FALLBACK_AVATAR}')` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="min-w-0">
                                            <h3 className="font-black text-xl text-white drop-shadow-md truncate">
                                                {consultant.profiles?.full_name || "Consultant"}
                                            </h3>
                                            <p className="text-[10px] text-white/90 font-bold uppercase tracking-widest drop-shadow-md truncate">
                                                {[consultant.university, consultant.major].filter(Boolean).join(" • ") || "Consultant"}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                                            {consultant.linkedin_url && (
                                                <a
                                                    href={consultant.linkedin_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-7 h-7 flex justify-center items-center bg-[#0077b5]/90 hover:bg-[#0077b5] backdrop-blur-sm text-white rounded-lg hover:scale-110 transition-transform shadow-md"
                                                    title="LinkedIn"
                                                >
                                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                                </a>
                                            )}
                                            {consultant.github_url && (
                                                <a
                                                    href={consultant.github_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-7 h-7 flex justify-center items-center bg-slate-900/90 hover:bg-black backdrop-blur-sm border border-slate-700/50 text-white rounded-lg hover:scale-110 transition-transform shadow-md"
                                                    title="GitHub"
                                                >
                                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-5 leading-relaxed font-medium flex-1">
                                    {consultant.bio || <span className="italic opacity-50">No bio added yet.</span>}
                                </p>

                                {consultant.specializations && consultant.specializations.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-5">
                                        {consultant.specializations.slice(0, 3).map((tag: string) => (
                                            <span key={tag} className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg font-black uppercase tracking-wider">
                                                {tag}
                                            </span>
                                        ))}
                                        {consultant.specializations.length > 3 && (
                                            <span className="text-[9px] text-slate-400 font-bold px-2 py-1">+{consultant.specializations.length - 3}</span>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedConsultant(consultant);
                                        }}
                                        className="flex-1 w-full text-center bg-primary/5 hover:bg-primary text-primary hover:text-white font-black uppercase tracking-widest py-3 px-4 rounded-xl transition-all text-[11px] border border-primary/20"
                                    >
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modals */}
            {selectedConsultant && (
                <ConsultantDetailsModal
                    consultant={selectedConsultant}
                    onClose={() => setSelectedConsultant(null)}
                />
            )}
        </div>
    );
}
