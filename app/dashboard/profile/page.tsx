"use client";

import { createClient } from "@/lib/supabase";
import { useUser, useAuth, useClerk } from "@clerk/nextjs";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface StudentProfile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    email: string | null;
    role: string | null;
}

interface Student {
    id: string;
    school_name: string;
    school_city: string;
    stream: string;
    bio: string | null;
    interests: string[] | null;
    profiles?: StudentProfile;
}

interface EditForm {
    school_name: string;
    school_city: string;
    stream: string;
    bio: string;
    interests: string[];
}

export default function StudentProfilePage() {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const { signOut } = useClerk();
    const router = useRouter();

    const [profile, setProfile] = useState<Student | null>(null);
    const [stats, setStats] = useState({ totalBookings: 0 });
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    // Dropdown states
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState<EditForm>({
        school_name: "",
        school_city: "",
        stream: "",
        bio: "",
        interests: [],
    });
    const [interestInput, setInterestInput] = useState("");
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfileMenu(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const fetchData = async () => {
        if (!user) return;
        setLoading(true);
        setFetchError(null);

        const executeRequest = async (token: string) => {
            const supabase = createClient(token);

            // 1. Fetch Student Data
            const { data: sdkData, error: studentError } = await supabase
                .from("students")
                .select(`
                    *,
                    profiles:id (full_name, avatar_url, email, role)
                `)
                .eq("id", user.id)
                .maybeSingle();

            let studentData = sdkData;

            if (studentError?.code === "PGRST116" || !studentData) {
                // Auto-provision logic remains inside the retryable block
                const { error: pError } = await supabase.from("profiles").upsert({
                    id: user.id,
                    email: user.primaryEmailAddress?.emailAddress,
                    full_name: user.fullName,
                    avatar_url: user.imageUrl,
                    role: 'student'
                });
                if (pError) throw pError;

                const { data: newStudent, error: createError } = await supabase.from("students").upsert({
                    id: user.id,
                    stream: "Not specified",
                    school_name: "Not specified",
                    school_city: "Not specified"
                }).select(`*, profiles:id (full_name, avatar_url, email, role)`).single();

                if (createError) throw createError;
                studentData = newStudent;
            } else if (studentError) {
                throw studentError;
            } else {
                studentData = sdkData;
            }

            setProfile(studentData);

            // 2. Fetch Stats
            const { count, error: countError } = await supabase
                .from("bookings")
                .select("*", { count: "exact", head: true })
                .eq("student_id", user.id);

            if (!countError) setStats({ totalBookings: count || 0 });
        };

        try {
            // Initial attempt with standard token
            let token = await getToken({ template: "supabase" });
            try {
                await executeRequest(token!);
            } catch (err: unknown) {
                const supabaseError = err as { code?: string; status?: number };
                // If 401/403, retry once with skipCache: true
                if (supabaseError.code === "PGRST303" || supabaseError.status === 401 || supabaseError.status === 403) {
                    console.log("JWT expired/invalid, retrying with fresh token...");
                    token = await getToken({ template: "supabase", skipCache: true });
                    await executeRequest(token!);
                } else {
                    throw err;
                }
            }
        } catch (err: unknown) {
            console.error("Fetch error:", err);
            const error = err as Error;
            setFetchError(error.message || "Could not load profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoaded) fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded, getToken]);

    const openEditModal = () => {
        if (!profile || !profile.profiles) return;
        setEditForm({
            school_name: profile.school_name || "Not specified",
            school_city: profile.school_city || "Not specified",
            stream: profile.stream || "Not specified",
            bio: profile.bio || "",
            interests: profile.interests || [],
        });
        setIsEditModalOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        setSaveError(null);

        const executeSave = async (token: string) => {
            const supabase = createClient(token);
            const finalInterests = [...(editForm.interests ?? [])];
            const pending = interestInput.trim().replace(/,$/, '');
            if (pending && !finalInterests.includes(pending)) {
                finalInterests.push(pending);
                setInterestInput("");
            }

            const { error: studentError } = await supabase.from("students").update({
                school_name: editForm.school_name,
                school_city: editForm.school_city,
                stream: editForm.stream,
                bio: editForm.bio,
                interests: finalInterests,
            }).eq("id", user?.id);

            if (studentError) throw studentError;
        };

        try {
            let token = await getToken({ template: "supabase" });
            try {
                await executeSave(token!);
            } catch (err: unknown) {
                const supabaseError = err as { code?: string; status?: number };
                if (supabaseError.code === "PGRST303" || supabaseError.status === 401 || supabaseError.status === 403) {
                    token = await getToken({ template: "supabase", skipCache: true });
                    await executeSave(token!);
                } else {
                    throw err;
                }
            }
            await fetchData();
            setIsEditModalOpen(false);
        } catch (err: unknown) {
            const error = err as Error;
            setSaveError(error.message || "Failed to save profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-primary/60 font-black animate-pulse text-[10px] uppercase tracking-[0.3em]">Syncing Profile...</p>
            </div>
        </div>
    );

    if (fetchError) return (
        <div className="flex h-screen items-center justify-center p-6 bg-background-light dark:bg-background-dark">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center shadow-xl">
                <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-red-500 text-3xl">error</span>
                </div>
                <h2 className="text-xl font-black text-slate-800 dark:text-white mb-2">Oops! Profile Error</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm leading-relaxed">{fetchError}</p>
                <div className="flex flex-col gap-3">
                    <button onClick={() => fetchData()} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-opacity">Retry Loading</button>
                    <Link href="/dashboard" className="w-full py-3 text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">Back to Dashboard</Link>
                </div>
            </div>
        </div>
    );

    const isInternalIncomplete = !profile?.bio || profile?.school_name === "Not specified";

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col transition-colors duration-300">
            {/* Standard Header */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 sm:px-8 lg:px-40 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2 group">
                            <Image
                                src="/unimate.png"
                                alt="UniMate"
                                width={36}
                                height={36}
                                className="rounded-full object-cover group-hover:scale-110 transition-transform"
                            />
                            <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">UniMate</h2>
                        </Link>
                    </div>
                    <div className="flex items-center gap-6">
                        <nav className="hidden sm:flex items-center gap-6">
                            <Link href="/dashboard" className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Dashboard</Link>
                            <Link href="/dashboard/consultants" className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Find Mentors</Link>
                        </nav>
                        <div className="relative" ref={profileRef}>
                            <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="relative rounded-full h-10 w-10 ring-2 ring-primary/30 hover:ring-primary/60 transition-all overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm">
                                <Image
                                    src={user?.imageUrl || "/fallback-avatar.png"}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                            </button>
                            {showProfileMenu && (
                                <div className="absolute right-0 top-12 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                                        <p className="text-sm font-black text-slate-800 dark:text-white truncate">{user?.fullName}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Student</p>
                                    </div>
                                    <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary transition-all">
                                        <span className="material-symbols-outlined text-lg">person</span> My Profile
                                    </Link>
                                    <button onClick={() => signOut(() => router.push("/"))} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                        <span className="material-symbols-outlined text-lg">logout</span> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">


                {/* Top Incomplete Banner */}
                {isInternalIncomplete && (
                    <div className="relative overflow-hidden bg-primary/10 dark:bg-primary/5 border border-primary/20 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-primary text-xl">info</span>
                            </div>
                            <p className="text-sm font-bold text-primary leading-tight">Your profile is missing some details. Mentors can guide you better with a complete profile.</p>
                        </div>
                        <button onClick={openEditModal} className="shrink-0 px-6 py-2.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:shadow-xl hover:scale-105 transition-all active:scale-95 shadow-lg shadow-primary/20">Complete Profile</button>
                    </div>
                )}

                {/* Hero Card */}
                <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200/50 dark:border-slate-800 shadow-2xl shadow-teal-900/10 dark:shadow-none animate-in fade-in slide-in-from-top-4 duration-1000">
                    {/* Premium Mesh Gradient Background */}
                    <div className="h-64 sm:h-72 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary via-teal-500 to-accent animate-gradient-xy"></div>
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/20 blur-[120px] rounded-full animate-pulse"></div>
                        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/30 blur-[100px] rounded-full"></div>
                        <div className="absolute inset-0 bg-white/5 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
                        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>

                    <div className="px-6 sm:px-12 pb-12">
                        <div className="relative flex flex-col items-center sm:items-end sm:flex-row gap-8 -mt-24 sm:-mt-28">
                            {/* Avatar Section */}
                            <div className="relative shrink-0">
                                <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-[3.5rem] border-[10px] border-white dark:border-slate-900 overflow-hidden shadow-2xl bg-white group ring-1 ring-slate-100 dark:ring-slate-800">
                                    <Image
                                        src={user?.imageUrl || profile?.profiles?.avatar_url || ""}
                                        alt={user?.fullName || profile?.profiles?.full_name || "Student Profile"}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                    />
                                </div>
                                <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 border-4 border-white dark:border-slate-900 rounded-full shadow-lg" />
                            </div>

                            {/* Identity Section */}
                            <div className="flex-1 text-center sm:text-left space-y-4 pb-2 pt-4 sm:pt-4">
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                                    <h1 className="text-3xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight drop-shadow-sm">
                                        {user?.fullName || profile?.profiles?.full_name}
                                    </h1>
                                    <span className="px-5 py-2 bg-primary text-white text-[11px] font-black uppercase tracking-[0.25em] rounded-full shadow-xl shadow-primary/30 ring-4 ring-white dark:ring-slate-900">
                                        STUDENT
                                    </span>
                                </div>

                                <div className="relative inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-700 shadow-sm">
                                    <p className="text-slate-800 dark:text-slate-200 font-black text-base">
                                        {profile?.stream || "Academic"} Student
                                        <span className="text-primary/40 mx-2 text-xl">/</span>
                                        <span className="text-primary dark:text-accent uppercase tracking-wide">{profile?.school_name || "School"}</span>
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-2">
                                    <StatChip icon="school" label={`${profile?.school_city || "City"}`} />
                                    <StatChip icon="video_chat" label={`${stats.totalBookings} Booked`} />
                                    <StatChip icon="verified" label="Identity Verified" variant="success" />
                                </div>
                            </div>
                            <button onClick={openEditModal} className="shrink-0 w-full sm:w-auto px-8 py-4 bg-primary text-white font-black uppercase tracking-widest text-[11px] rounded-[1.5rem] hover:scale-105 hover:shadow-2xl transition-all active:scale-95 shadow-lg shadow-primary/30">Edit Profile</button>
                        </div>
                    </div>
                </div>

                {/* Body Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Sections */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="p-10 sm:p-12">
                            <SectionTitle icon="person">About Me</SectionTitle>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-slate-800 dark:text-slate-200 text-base sm:text-lg leading-relaxed whitespace-pre-wrap font-medium">
                                    {profile?.bio || "No bio added yet. Tell mentors about your academic goals and what kind of guidance you&apos;re looking for!"}
                                </p>
                            </div>
                        </Card>

                        <Card className="p-10 sm:p-12">
                            <SectionTitle icon="school">Education Details</SectionTitle>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DetailItem label="Current Institution" value={profile?.school_name || "Not set"} icon="apartment" color="teal" />
                                <DetailItem label="Home City" value={profile?.school_city || "Not set"} icon="location_on" color="teal" />
                                <DetailItem label="Academic Stream" value={profile?.stream || "Not set"} icon="history_edu" color="teal" />
                                <DetailItem label="Verification" value="Student Verified" icon="verified_user" color="teal" />
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar Sections */}
                    <div className="space-y-8">
                        <Card className="p-8 sm:p-10">
                            <SectionTitle icon="interests">Areas of Interest</SectionTitle>
                            {profile?.interests && profile.interests.length > 0 ? (
                                <div className="flex flex-wrap gap-2.5">
                                    {profile.interests.map((tag: string) => (
                                        <InterestTag key={tag}>{tag}</InterestTag>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                    <p className="text-sm text-slate-400 font-bold mb-3 italic">Discover your passions...</p>
                                    <button onClick={openEditModal} className="text-xs text-primary font-black uppercase hover:underline">Add Interests</button>
                                </div>
                            )}
                        </Card>

                        <Card className="p-8 sm:p-10 bg-gradient-to-br from-primary to-accent border-none shadow-xl shadow-primary/20 text-white">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 ring-1 ring-white/30">
                                <span className="material-symbols-outlined text-white text-3xl">hub</span>
                            </div>
                            <h3 className="text-xl font-black mb-2">Connect with Mentors</h3>
                            <p className="text-white/80 text-sm leading-relaxed mb-8 font-medium">Get internal insights on college life, placements, and campus culture directly from seniors.</p>
                            <Link href="/dashboard/consultants" className="block w-full text-center py-4 bg-white text-primary font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-slate-50 transition-all shadow-xl shadow-black/10 active:scale-95">Explore Mentors</Link>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Premium Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setIsEditModalOpen(false)} />
                    <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl flex flex-col animate-in zoom-in-95 duration-500 border border-slate-100 dark:border-slate-800">
                        {/* Modal Header */}
                        <div className="p-8 sm:p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                            <div>
                                <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Update Profile</h2>
                                <p className="text-slate-400 text-sm font-bold mt-1.5 uppercase tracking-widest leading-none">Profile Metadata & Interests</p>
                            </div>
                            <button onClick={() => setIsEditModalOpen(false)} className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:rotate-90 transition-all duration-300">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 sm:p-10 overflow-y-auto grow custom-scrollbar">
                            <div className="space-y-10">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <Field label="School Name" hint="Where you currently study">
                                        <input type="text" value={editForm.school_name} onChange={e => setEditForm({ ...editForm, school_name: e.target.value })} className={inputCls} placeholder="e.g. Modern School" />
                                    </Field>
                                    <Field label="City" hint="Current city">
                                        <input type="text" value={editForm.school_city} onChange={e => setEditForm({ ...editForm, school_city: e.target.value })} className={inputCls} placeholder="e.g. Delhi" />
                                    </Field>
                                    <Field label="Academic Stream">
                                        <select value={editForm.stream} onChange={e => setEditForm({ ...editForm, stream: e.target.value })} className={inputCls}>
                                            <option value="">Select Stream</option>
                                            <option value="PCM">PCM</option>
                                            <option value="PCB">PCB</option>
                                            <option value="Commerce">Commerce</option>
                                            <option value="Arts">Arts</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </Field>
                                </div>

                                <Field label="Bio / About Me" hint="Share your academic goals">
                                    <textarea rows={4} value={editForm.bio} onChange={e => setEditForm({ ...editForm, bio: e.target.value })} className={`${inputCls} resize-none`} placeholder="Tell mentors what you hope to achieve..." />
                                </Field>

                                <Field label="Areas of Interest" hint="Press Enter to add chips">
                                    <div className="flex flex-wrap gap-2.5 p-4 rounded-3xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 focus-within:border-primary/50 transition-all min-h-[64px]" onClick={() => (document.getElementById('interest-input') as HTMLInputElement | null)?.focus()}>
                                        {(editForm.interests).map((tag: string) => (
                                            <span key={tag} className="flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] font-black uppercase tracking-widest rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm animate-in zoom-in-90 group transition-all">
                                                {tag}
                                                <button type="button" onClick={(e) => { e.stopPropagation(); setEditForm({ ...editForm, interests: editForm.interests.filter((t: string) => t !== tag) }) }} className="text-slate-400 hover:text-red-500 transition-colors">
                                                    <span className="material-symbols-outlined text-sm">close</span>
                                                </button>
                                            </span>
                                        ))}
                                        <input
                                            id="interest-input"
                                            value={interestInput}
                                            onChange={e => setInterestInput(e.target.value)}
                                            onKeyDown={e => {
                                                const val = interestInput.trim().replace(/,$/, '');
                                                if ((e.key === 'Enter' || e.key === ',') && val) {
                                                    e.preventDefault();
                                                    if (!editForm.interests?.includes(val)) {
                                                        setEditForm({ ...editForm, interests: [...(editForm.interests ?? []), val] });
                                                    }
                                                    setInterestInput("");
                                                } else if (e.key === 'Backspace' && !interestInput && editForm.interests?.length > 0) {
                                                    setEditForm({ ...editForm, interests: editForm.interests.slice(0, -1) });
                                                }
                                            }}
                                            className="grow bg-transparent border-none outline-none text-sm font-bold placeholder-slate-400 min-w-[120px]"
                                            placeholder={(editForm.interests?.length ?? 0) === 0 ? "Computer Science, JEE, Abroad Study..." : "Add more..."}
                                        />
                                    </div>
                                </Field>

                                {saveError && <p className="text-red-500 text-xs font-bold bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl border border-red-100 dark:border-red-900/50">⚠ {saveError}</p>}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 sm:p-10 border-t border-slate-100 dark:border-slate-800 flex gap-4 shrink-0 bg-slate-50/30 dark:bg-slate-900/30">
                            <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 text-slate-500 font-black rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest text-[11px]">Discard</button>
                            <button onClick={handleSave} disabled={saving} className="flex-[2] py-4 bg-primary text-white font-black rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-3 uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20">
                                {saving ? <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Updating...</> : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes gradient-xy {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient-xy {
                    background-size: 400% 400%;
                    animation: gradient-xy 15s ease infinite;
                }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #0D948833; border-radius: 10px; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #ffffff11; }
            `}</style>
        </div>
    );
}

// Sub-components
function Card({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return <div className={`bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none duration-500 ${className}`}>{children}</div>;
}

function SectionTitle({ icon, children }: { icon: string, children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/5 flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
                <span className="material-symbols-outlined text-primary text-xl leading-none">{icon}</span>
            </div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight leading-none">{children}</h2>
        </div>
    );
}

function StatChip({ icon, label, variant = "default" }: { icon: string; label: string; variant?: "default" | "success" }) {
    const bgCls = variant === "success" ? "bg-teal-50 dark:bg-teal-900/30 border-teal-100 dark:border-teal-800/50" : "bg-slate-100 dark:bg-slate-800 border-slate-200/50 dark:border-slate-700/50";
    const textCls = variant === "success" ? "text-teal-600 dark:text-teal-400" : "text-slate-600 dark:text-slate-300";
    const iconCls = variant === "success" ? "text-teal-500" : "text-slate-400";

    return (
        <div className={`flex items-center gap-2 px-4 py-2 ${bgCls} rounded-2xl border shadow-sm`}>
            <span className={`material-symbols-outlined ${iconCls} text-lg`}>{icon}</span>
            <span className={`text-xs font-black uppercase tracking-widest ${textCls}`}>{label}</span>
        </div>
    );
}

function DetailItem({ label, value, icon, color = "slate" }: { label: string; value: string; icon: string; color?: string }) {
    const colors: Record<string, string> = {
        teal: "bg-primary/10 text-primary",
        slate: "bg-slate-50 dark:bg-slate-800 text-slate-400"
    };

    return (
        <div className="flex items-center gap-5 p-5 rounded-[2rem] bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-800 group hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 border-dashed">
            <div className={`w-12 h-12 rounded-2xl ${colors[color] || colors.slate} flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-2xl">{icon}</span>
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 leading-none">{label}</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{value || "Not set"}</p>
            </div>
        </div>
    );
}

function InterestTag({ children }: { children: React.ReactNode }) {
    return (
        <span className="px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-black uppercase tracking-[0.1em] rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-default scale-100 hover:scale-105 active:scale-95">
            {children}
        </span>
    );
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</label>
                {hint && <span className="text-[10px] text-primary/60 font-black uppercase tracking-widest">{hint}</span>}
            </div>
            {children}
        </div>
    );
}

const inputCls = "w-full p-4.5 px-6 rounded-2xl border-2 border-slate-200/50 dark:border-slate-800 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white outline-none focus:border-primary/50 focus:bg-white dark:focus:bg-slate-800 transition-all text-[15px] font-bold shadow-sm placeholder:text-slate-300 dark:placeholder:text-slate-600";
