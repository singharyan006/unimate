"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { BookingModal } from "@/components/booking-modal";
import { SuccessModal } from "@/components/success-modal";
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

export default function AllConsultantsPage() {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const router = useRouter();

    const [consultants, setConsultants] = useState<Consultant[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
    const [selectedConsultantDetails, setSelectedConsultantDetails] = useState<Consultant | null>(null);
    const [showSuccess, setShowSuccess] = useState<Consultant | null>(null);

    // Role check
    useEffect(() => {
        if (isLoaded && user) {
            const role = user.unsafeMetadata.role as string;
            if (!role) router.push("/onboarding");
            else if (role !== "student") router.push("/consultant");
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
            setConsultants((data || []) as unknown as Consultant[]);
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
            console.error("Error fetching consultants:", err);
        } finally {
            setLoading(false);
        }
    }, [getToken]);

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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 sm:px-8 lg:px-40 py-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors font-medium text-sm">
                        <span className="material-icons-outlined text-lg">arrow_back</span>
                        Dashboard
                    </Link>
                    <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />
                    <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-80">
                        <Image
                            src="/unimate.png"
                            alt="UniMate"
                            width={36}
                            height={36}
                            className="rounded-full object-cover"
                        />
                        <span className="font-bold text-slate-800 dark:text-white">UniMate</span>
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-10">

                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-2">
                        Discover Experts
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-base">
                        Browse all consultants and find the perfect mentor for your journey.
                    </p>
                </div>

                {/* Search + Filters */}
                <div className="flex flex-col gap-4 mb-8">
                    <label className="flex items-center h-13 w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary transition-all shadow-sm">
                        <span className="material-icons-outlined text-primary mr-3">search</span>
                        <input
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder:text-slate-400 font-medium outline-none text-slate-900 dark:text-white"
                            placeholder="Search by name, university, major..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <span className="material-icons-outlined text-sm">close</span>
                            </button>
                        )}
                    </label>

                    <div className="flex flex-wrap gap-2">
                        {FILTERS.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setSelectedFilter(filter)}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedFilter === filter
                                    ? "bg-primary text-white shadow-md shadow-primary/20"
                                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 text-slate-600 dark:text-slate-300"
                                    }`}
                            >
                                {filter === "All" ? "All Specialists" : filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Result Count */}
                {!loading && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                        <span className="font-bold text-slate-700 dark:text-slate-200">{filtered.length}</span> consultant{filtered.length !== 1 ? "s" : ""} found
                        {selectedFilter !== "All" && <span className="ml-1">in <span className="text-primary font-bold">{selectedFilter}</span></span>}
                    </p>
                )}

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-pulse">
                                <div className="h-52 bg-slate-100 dark:bg-slate-800" />
                                <div className="p-5 flex flex-col gap-3">
                                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-3/4" />
                                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full w-1/2" />
                                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full w-full" />
                                    <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl mt-2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
                        <span className="material-icons-outlined text-5xl text-slate-300 dark:text-slate-700">search_off</span>
                        <h3 className="text-xl font-bold text-slate-600 dark:text-slate-400">No consultants found</h3>
                        <p className="text-slate-400 text-sm max-w-xs">Try changing your search or clearing the filter.</p>
                        <button onClick={() => { setSearchQuery(""); setSelectedFilter("All"); }}
                            className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition-opacity">
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.map((consultant) => (
                            <div
                                key={consultant.id}
                                onClick={() => setSelectedConsultantDetails(consultant)}
                                className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
                            >
                                <div
                                    className="relative h-52 w-full bg-center bg-cover"
                                    style={{ backgroundImage: `url('${consultant.profiles?.avatar_url || FALLBACK_AVATAR}')` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                    {consultant.rating && (
                                        <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl px-2.5 py-1 flex items-center gap-1 shadow-sm">
                                            <span className="material-icons-outlined text-yellow-500 text-sm">star</span>
                                            <span className="text-xs font-bold text-slate-800 dark:text-white">{consultant.rating}</span>
                                            <span className="text-[10px] text-slate-500">({consultant.review_count || 0})</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-5 flex flex-col flex-1">
                                    <div className="mb-1">
                                        <h3 className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-primary transition-colors leading-tight">
                                            {consultant.profiles?.full_name || "Consultant"}
                                        </h3>
                                    </div>

                                    <p className="text-[11px] text-primary font-bold mb-2 uppercase tracking-widest">
                                        {[consultant.university, consultant.major].filter(Boolean).join(" • ") || "Consultant"}
                                    </p>

                                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed flex-1">
                                        {consultant.bio || "No bio added yet."}
                                    </p>

                                    {consultant.specializations && consultant.specializations.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {consultant.specializations.slice(0, 3).map((tag: string) => (
                                                <span key={tag} className="text-[10px] bg-secondary dark:bg-slate-800 text-primary px-2.5 py-1 rounded-md font-bold">
                                                    {tag}
                                                </span>
                                            ))}
                                            {consultant.specializations.length > 3 && (
                                                <span className="text-[10px] text-slate-400 px-2 py-1">+{consultant.specializations.length - 3}</span>
                                            )}
                                        </div>
                                    )}

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedConsultant(consultant);
                                        }}
                                        className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold py-2.5 px-4 rounded-xl transition-all text-sm border border-primary/5"
                                    >
                                        Book Session
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Modals */}
            {selectedConsultantDetails && (
                <ConsultantDetailsModal
                    consultant={selectedConsultantDetails}
                    onClose={() => setSelectedConsultantDetails(null)}
                    onBook={() => {
                        setSelectedConsultantDetails(null);
                        setSelectedConsultant(selectedConsultantDetails);
                    }}
                />
            )}

            {selectedConsultant && (
                <BookingModal
                    consultant={selectedConsultant}
                    onClose={() => setSelectedConsultant(null)}
                    onSuccess={() => {
                        setShowSuccess(selectedConsultant);
                        setSelectedConsultant(null);
                    }}
                />
            )}
            {showSuccess && (
                <SuccessModal
                    consultantName={showSuccess?.profiles?.full_name || "the consultant"}
                    onClose={() => setShowSuccess(null)}
                />
            )}
        </div>
    );
}
