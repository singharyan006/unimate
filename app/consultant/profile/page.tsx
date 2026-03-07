"use client";

import { createClient } from "@/lib/supabase";
import { useUser, useAuth, useClerk } from "@clerk/nextjs";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteCurrentUser } from "@/app/actions/user";


const LANGUAGE_OPTIONS = [
    "English", "Hindi", "Tamil", "Telugu", "Kannada",
    "Bengali", "Marathi", "Gujarati", "Other",
];

const FALLBACK_AVATAR = "https://api.dicebear.com/9.x/notionists/svg?seed=Felix&backgroundColor=e0f2fe";

interface Profile {
    full_name: string | null;
    avatar_url: string | null;
    email: string | null;
    phone_number: string | null;
}

interface ConsultantProfile {
    id: string;
    university: string | null;
    major: string | null;
    graduation_year: string | null;
    college_city: string | null;
    college_email: string | null;
    aadhaar_number: string | null;
    titles: string[] | null;
    bio: string | null;
    github_url: string | null;
    linkedin_url: string | null;
    experience_years: number | null;
    hourly_rate: number;
    specializations: string[] | null;
    languages: string[] | null;
    verified: boolean;
    profiles?: Profile | null;
}

interface EditForm {
    full_name: string;
    university: string;
    major: string;
    graduation_year: string;
    college_city: string;
    college_email: string;
    aadhaar_number: string;
    titles: string;
    bio: string;
    github_url: string;
    linkedin_url: string;
    experience_years: string | number;
    hourly_rate: string | number;
    specializations: string[];
    languages: string[];
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm ${className}`}>
            {children}
        </div>
    );
}

function SectionTitle({ icon, children }: { icon: string; children: React.ReactNode }) {
    return (
        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4 text-sm uppercase tracking-wider">
            <span className="material-symbols-outlined text-primary text-[18px]">{icon}</span>
            {children}
        </h3>
    );
}

export default function ProfilePage() {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const { signOut } = useClerk();
    const router = useRouter();
    const [profile, setProfile] = useState<ConsultantProfile | null>(null);
    const [sessionCount, setSessionCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    // Edit Modal State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<EditForm>({} as EditForm);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [expertiseInput, setExpertiseInput] = useState("");
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            setLoading(true);
            setFetchError(null);

            const executeFetch = async (token: string) => {
                const supabase = createClient(token);

                // Step 1 — fetch consultant row
                let { data, error } = await supabase
                    .from("consultants")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                // Step 2 — if missing, auto-create
                if (error?.code === "PGRST116" || (!data && error)) {
                    console.warn("No consultant row — creating one now…");

                    await supabase.from("profiles").upsert({
                        id: user.id,
                        email: user.primaryEmailAddress?.emailAddress ?? "",
                        full_name: user.fullName ?? "",
                        avatar_url: user.imageUrl ?? "",
                        role: "consultant",
                    });

                    await supabase.from("consultants").upsert({
                        id: user.id,
                        verified: false,
                        hourly_rate: 0,
                    });

                    const refetch = await supabase
                        .from("consultants")
                        .select("*")
                        .eq("id", user.id)
                        .single();

                    data = refetch.data;
                    error = refetch.error;
                }

                if (error) throw error;

                if (data) {
                    const { data: profileRow } = await supabase
                        .from("profiles")
                        .select("full_name, avatar_url, email, phone_number")
                        .eq("id", user.id)
                        .single();

                    setProfile({ ...data, profiles: profileRow ?? null });
                }

                const { count } = await supabase
                    .from("bookings")
                    .select("*", { count: "exact", head: true })
                    .eq("consultant_id", user.id)
                    .eq("status", "completed");

                setSessionCount(count ?? 0);
            };

            try {
                let token = await getToken({ template: "supabase" });
                try {
                    await executeFetch(token!);
                } catch (err: unknown) {
                    const supabaseError = err as { code?: string; status?: number };
                    if (supabaseError.code === "PGRST303" || supabaseError.status === 401 || supabaseError.status === 403) {
                        token = await getToken({ template: "supabase", skipCache: true });
                        await executeFetch(token!);
                    } else {
                        throw err;
                    }
                }
            } catch (err: unknown) {
                console.error("Profile fetch error:", err);
                const error = err as Error;
                setFetchError(error.message || "Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, getToken]);

    const openEditModal = () => {
        if (!profile) return;
        setEditForm({
            full_name: profile.profiles?.full_name || "",
            university: profile.university || "",
            major: profile.major || "",
            graduation_year: profile.graduation_year || "",
            college_city: profile.college_city || "",
            college_email: profile.college_email || "",
            aadhaar_number: profile.aadhaar_number || "",
            titles: profile.titles?.join(", ") ?? "",
            bio: profile.bio || "",
            github_url: profile.github_url || "",
            linkedin_url: profile.linkedin_url || "",
            experience_years: profile.experience_years ?? 0,
            hourly_rate: profile.hourly_rate ?? 0,
            specializations: profile.specializations ?? [],
            languages: profile.languages ?? [],
        });
        setAvatarPreview(profile.profiles?.avatar_url || user?.imageUrl || "");
        setAvatarFile(null);
        setSaveError(null);
        setIsEditing(true);
    };

    const toggleArrayItem = (key: "specializations" | "languages", value: string) => {
        setEditForm((prev) => {
            const arr: string[] = prev[key] ?? [];
            return {
                ...prev,
                [key]: arr.includes(value) ? arr.filter((x: string) => x !== value) : [...arr, value],
            };
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSaving(true);
        setSaveError(null);

        if (!editForm.full_name?.trim() || !editForm.university?.trim() || !editForm.major?.trim() || !editForm.graduation_year?.trim() || !editForm.college_city?.trim() || !editForm.college_email?.trim() || !editForm.aadhaar_number?.trim() || !editForm.bio?.trim() || !editForm.github_url?.trim() || !editForm.linkedin_url?.trim() || (editForm.languages?.length ?? 0) === 0) {
            setSaveError("All fields are required. Please fill in all the details.");
            setSaving(false);
            return;
        }

        if (!avatarFile && !avatarPreview) {
            setSaveError("Profile Photo is required. Please upload an image.");
            setSaving(false);
            return;
        }

        const executeSave = async (token: string) => {
            const supabase = createClient(token);
            let finalAvatarUrl = profile?.profiles?.avatar_url || user?.imageUrl;

            if (avatarFile) {
                const fileExt = avatarFile.name.split(".").pop();
                const fileName = `${user.id}-${Date.now()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from("avatars")
                    .upload(fileName, avatarFile, { upsert: true });

                if (uploadError) throw new Error(`Avatar upload failed: ${uploadError.message}`);

                const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
                finalAvatarUrl = publicUrlData.publicUrl;
            }

            const { error: profileError } = await supabase.from("profiles").update({
                full_name: editForm.full_name,
                avatar_url: finalAvatarUrl
            }).eq("id", user.id);
            if (profileError) throw profileError;

            let githubUrl = editForm.github_url?.trim() || null;
            if (githubUrl && !githubUrl.startsWith("http")) githubUrl = `https://github.com/${githubUrl}`;

            const titlesArray = editForm.titles
                ? editForm.titles.split(",").map((t: string) => t.trim()).filter(Boolean)
                : [];

            let linkedinUrl = editForm.linkedin_url?.trim() || null;
            if (linkedinUrl && !linkedinUrl.startsWith("http")) linkedinUrl = `https://linkedin.com/in/${linkedinUrl}`;

            const finalSpecializations = [...(editForm.specializations ?? [])];
            const pendingExpertise = expertiseInput.trim().replace(/,$/, '');
            if (pendingExpertise && !finalSpecializations.includes(pendingExpertise)) {
                finalSpecializations.push(pendingExpertise);
                setExpertiseInput('');
            }

            const updatePayload = {
                university: editForm.university || null,
                major: editForm.major || null,
                graduation_year: editForm.graduation_year || null,
                college_city: editForm.college_city || null,
                college_email: editForm.college_email || null,
                aadhaar_number: editForm.aadhaar_number || null,
                titles: titlesArray,
                bio: editForm.bio || null,
                github_url: githubUrl,
                linkedin_url: linkedinUrl,
                experience_years: parseInt(String(editForm.experience_years), 10) || 0,
                hourly_rate: parseFloat(String(editForm.hourly_rate)) || 0,
                specializations: finalSpecializations,
                languages: editForm.languages,
            };

            const { error: consultantError } = await supabase
                .from("consultants")
                .update(updatePayload)
                .eq("id", user.id);

            if (consultantError) throw consultantError;

            setProfile(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    ...updatePayload,
                    profiles: prev.profiles ? { ...prev.profiles, full_name: editForm.full_name, avatar_url: finalAvatarUrl } : null,
                };
            });

            setIsEditing(false);
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
        } catch (err: unknown) {
            console.error("Error saving profile:", err);
            const error = err as Error;
            setSaveError(error.message || "Something went wrong. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!user) return;
        const confirmed = window.confirm(
            "Are you absolutely sure you want to delete your entire account? This action cannot be undone and will erase all your profile data and sessions forever."
        );
        if (!confirmed) return;

        setDeleting(true);
        try {
            const executeSupabaseDelete = async (token: string) => {
                const supabase = createClient(token);
                await supabase.from("consultants").delete().eq("id", user.id);
                await supabase.from("profiles").delete().eq("id", user.id);
            };

            let token = await getToken({ template: "supabase" });
            try {
                await executeSupabaseDelete(token!);
            } catch (err: unknown) {
                const supabaseError = err as { code?: string; status?: number };
                if (supabaseError.code === "PGRST303" || supabaseError.status === 401 || supabaseError.status === 403) {
                    token = await getToken({ template: "supabase", skipCache: true });
                    await executeSupabaseDelete(token!);
                }
            }

            await deleteCurrentUser();
            await signOut();
            router.push("/");
        } catch (err) {
            console.error("Failed to delete account:", err);
            alert("An error occurred while attempting to delete your account. Please try again later.");
            setDeleting(false);
        }
    };

    // ─── Loading ───────────────────────────────────────────────────────────────
    if (!isLoaded || loading) {
        return (
            <div className="flex flex-1 items-center justify-center p-8">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <p className="text-sm font-medium text-slate-400">Loading profile…</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex flex-1 items-center justify-center p-8">
                <div className="flex flex-col items-center gap-5 text-center max-w-md">
                    <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-slate-400">
                            {fetchError ? "error" : "person_off"}
                        </span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
                            {fetchError ? "Could not load profile" : "Profile not found"}
                        </h2>
                        <p className="text-slate-500 text-sm">
                            {fetchError
                                ? "There was a database error while loading your profile."
                                : "Your consultant record hasn't been created yet."}
                        </p>
                    </div>
                    {fetchError && (
                        <div className="w-full p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-left">
                            <p className="text-xs font-mono text-red-600 dark:text-red-400 break-all">{fetchError}</p>
                        </div>
                    )}
                    <div className="flex gap-3">
                        <button onClick={() => window.location.reload()}
                            className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">refresh</span>
                            Retry
                        </button>
                        {!fetchError && (
                            <Link href="/onboarding"
                                className="px-5 py-2.5 border border-primary text-primary rounded-xl font-bold hover:bg-primary/5 transition-colors text-sm">
                                Go to Onboarding
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const avatarSrc = profile.profiles?.avatar_url || user?.imageUrl || FALLBACK_AVATAR;
    const isIncomplete = !profile.bio || !profile.university || !profile.major;
    const displayName = profile.profiles?.full_name || user?.fullName || "Your Name";

    return (
        <div className="p-8 max-w-7xl w-full mx-auto">

            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-black tracking-tight text-slate-800 dark:text-white mb-1">My Profile</h1>
                <p className="text-slate-500 dark:text-slate-400 text-base">Manage how students see you on UniMate.</p>
            </div>

            {/* Incomplete Banner */}
            {isIncomplete && (
                <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center gap-4">
                    <span className="material-symbols-outlined text-amber-500 text-2xl shrink-0">warning</span>
                    <div className="flex-1">
                        <p className="text-amber-800 dark:text-amber-200 font-bold text-sm">Profile incomplete</p>
                        <p className="text-amber-700 dark:text-amber-300 text-xs mt-0.5">Add your university, degree, and bio to get discovered by more students.</p>
                    </div>
                    <button onClick={openEditModal}
                        className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors shrink-0">
                        Complete Now
                    </button>
                </div>
            )}

            {/* Hero Card */}
            <Card className="mb-6 overflow-hidden">
                <div className="h-2 w-full bg-gradient-to-r from-teal-500 via-primary to-blue-500" />
                <div className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">

                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div
                                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-cover bg-center border-4 border-white dark:border-slate-800 shadow-xl ring-2 ring-primary/20"
                                style={{ backgroundImage: `url("${avatarSrc}")` }}
                            />
                            {profile.verified && (
                                <div className="absolute -bottom-1 -right-1 bg-blue-500 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                                    <span className="material-symbols-outlined text-white text-[13px] fill-icon">verified</span>
                                </div>
                            )}
                        </div>

                        {/* Name & Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{displayName}</h2>
                                {profile.verified && (
                                    <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest rounded-full border border-blue-200 dark:border-blue-800">
                                        Verified
                                    </span>
                                )}
                            </div>

                            {(profile.major || profile.university) && (
                                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-4">
                                    <span className="material-symbols-outlined text-primary text-[16px]">school</span>
                                    {profile.major && <span>{profile.major}</span>}
                                    {profile.major && profile.university && <span className="text-slate-300 dark:text-slate-600">·</span>}
                                    {profile.university && <span className="font-semibold text-slate-700 dark:text-slate-200">{profile.university}</span>}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-2">
                                <StatChip icon="work_history" value={`${profile.experience_years ?? 0} yrs`} label="experience" />
                                <StatChip icon="check_circle" value={String(sessionCount)} label="sessions" />
                                {profile.languages && profile.languages.length > 0 && (
                                    <StatChip icon="translate"
                                        value={profile.languages.slice(0, 2).join(", ") + (profile.languages.length > 2 ? ` +${profile.languages.length - 2}` : "")}
                                        label="" />
                                )}
                                {profile.hourly_rate > 0 && <StatChip icon="payments" value={`₹${profile.hourly_rate}/hr`} label="" />}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                            {profile.linkedin_url && (
                                <SocialBtn href={profile.linkedin_url.startsWith("http") ? profile.linkedin_url : `https://linkedin.com/in/${profile.linkedin_url}`} title="LinkedIn" color="text-[#0077b5]">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                </SocialBtn>
                            )}
                            {profile.github_url && (
                                <SocialBtn href={profile.github_url.startsWith("http") ? profile.github_url : `https://github.com/${profile.github_url}`} title="GitHub" color="text-slate-800 dark:text-white">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                </SocialBtn>
                            )}
                            <button onClick={openEditModal}
                                className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Body Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left */}
                <div className="lg:col-span-2 flex flex-col gap-6">

                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <SectionTitle icon="person">About Me</SectionTitle>
                            {!profile.bio && <button onClick={openEditModal} className="text-xs text-primary font-bold hover:underline">+ Add Bio</button>}
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap text-sm">
                            {profile.bio || <span className="italic text-slate-400">No bio added yet. Click Edit Profile to add one.</span>}
                        </p>
                    </Card>

                    <Card className="p-6">
                        <SectionTitle icon="school">Education</SectionTitle>
                        {profile.university ? (
                            <div className="flex gap-4">
                                <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-indigo-500 text-[20px]">school</span>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 dark:text-white">{profile.university}</p>
                                    {profile.major && <p className="text-primary font-medium text-sm">{profile.major}</p>}
                                    <p className="text-slate-500 text-xs mt-1">
                                        {profile.college_city && <span>{profile.college_city}{profile.graduation_year ? " · " : ""}</span>}
                                        {profile.graduation_year && <span>Class of {profile.graduation_year}</span>}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-400 italic text-sm">No education info added yet.</p>
                        )}
                        {profile.titles && profile.titles.length > 0 && (
                            <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Achievements & Titles</p>
                                <div className="flex flex-wrap gap-2">
                                    {profile.titles.map((t: string, i: number) => (
                                        <span key={i} className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-lg border border-amber-100 dark:border-amber-900/30">{t}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>

                    <Card className="p-6">
                        <SectionTitle icon="payments">Pricing</SectionTitle>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-black text-slate-800 dark:text-white">
                                    {profile.hourly_rate > 0 ? `₹${profile.hourly_rate}` : "Free"}
                                    {profile.hourly_rate > 0 && <span className="text-base font-medium text-slate-400 ml-1">/hr</span>}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    {profile.hourly_rate > 0 ? "Charged per hour of session time" : "Set a rate above to start charging for sessions"}
                                </p>
                            </div>
                            <button onClick={openEditModal} className="px-4 py-2 text-sm font-bold text-primary border border-primary/30 rounded-xl hover:bg-primary/5 transition-colors">
                                Update Rate
                            </button>
                        </div>
                    </Card>
                </div>

                {/* Right */}
                <div className="flex flex-col gap-6">

                    <Card className="p-6">
                        <SectionTitle icon="psychology">Expertise</SectionTitle>
                        {profile.specializations && profile.specializations.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {profile.specializations.map((tag: string) => (
                                    <span key={tag} className="px-3 py-1.5 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 rounded-lg text-xs font-bold border border-teal-100 dark:border-teal-900/30">{tag}</span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400 italic text-sm">No expertise added yet.</p>
                        )}
                    </Card>

                    <Card className="p-6">
                        <SectionTitle icon="translate">Languages</SectionTitle>
                        {profile.languages && profile.languages.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {profile.languages.map((lang: string) => (
                                    <span key={lang} className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50">{lang}</span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400 italic text-sm">No languages added yet.</p>
                        )}
                    </Card>

                    <div className="bg-gradient-to-br from-primary to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-primary/20">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <span className="material-symbols-outlined text-[18px]">contact_page</span>
                            Contact Info
                        </h3>
                        <div className="flex flex-col gap-3">
                            <ContactRow icon="mail" value={profile.profiles?.email || user?.primaryEmailAddress?.emailAddress || ""} />
                            {profile.profiles?.phone_number && <ContactRow icon="call" value={profile.profiles.phone_number} />}
                            {profile.college_email && <ContactRow icon="school" value={profile.college_email} />}
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <Card className="p-6 border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10 transition-all">
                        <SectionTitle icon="warning">Danger Zone</SectionTitle>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                            Permanently delete your account, sessions, and all associated profile data. This action cannot be undone.
                        </p>
                        <button
                            onClick={handleDeleteAccount}
                            disabled={deleting}
                            className="w-full py-3 flex items-center justify-center gap-2 bg-red-100 hover:bg-red-500 text-red-600 hover:text-white dark:bg-red-900/30 dark:hover:bg-red-600 dark:text-red-400 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all"
                        >
                            {deleting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-red-500/20 border-t-red-500 group-hover:border-white/20 group-hover:border-t-white rounded-full animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[16px]">delete_forever</span>
                                    Delete Account
                                </>
                            )}
                        </button>
                    </Card>
                </div>
            </div>

            {/* ══════════════════════ EDIT MODAL ══════════════════════ */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 my-8">

                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                            <h2 className="text-xl font-black text-slate-800 dark:text-white">Edit Profile</h2>
                            <button onClick={() => setIsEditing(false)}
                                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSave}>
                            <div className="p-6 space-y-7">

                                {/* Avatar */}
                                <div className="flex items-center gap-5 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
                                    <div className="w-20 h-20 rounded-2xl bg-cover bg-center border-2 border-white dark:border-slate-700 shadow-md shrink-0"
                                        style={{ backgroundImage: `url("${avatarPreview}")` }} />
                                    <div>
                                        <p className="font-bold text-slate-700 dark:text-slate-200 text-sm mb-1">
                                            Profile Photo <span className="text-red-500 ml-1">*</span>
                                        </p>
                                        <p className="text-xs text-slate-500 mb-3">JPG or PNG. Upload a clear, professional photo.</p>
                                        <button type="button" onClick={() => avatarInputRef.current?.click()}
                                            className="px-3 py-1.5 text-xs font-bold bg-primary text-white rounded-lg hover:opacity-90 transition-opacity">
                                            Change Photo
                                        </button>
                                        <input ref={avatarInputRef} type="file" accept="image/*" className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) { setAvatarFile(file); setAvatarPreview(URL.createObjectURL(file)); }
                                            }} />
                                    </div>
                                </div>

                                {/* Education */}
                                <FieldGroup label="Basic Info & Education">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field label="Full Name">
                                            <input type="text" value={editForm.full_name || ""} onChange={e => setEditForm({ ...editForm, full_name: e.target.value })} placeholder="e.g. John Doe" className={inputCls} />
                                        </Field>
                                        <Field label="University / College">
                                            <input type="text" value={editForm.university} onChange={e => setEditForm({ ...editForm, university: e.target.value })} placeholder="e.g. IIT Delhi" className={inputCls} />
                                        </Field>
                                        <Field label="College City">
                                            <input type="text" value={editForm.college_city} onChange={e => setEditForm({ ...editForm, college_city: e.target.value })} placeholder="e.g. New Delhi" className={inputCls} />
                                        </Field>
                                        <Field label="Degree & Branch">
                                            <input type="text" value={editForm.major} onChange={e => setEditForm({ ...editForm, major: e.target.value })} placeholder="e.g. B.Tech CSE" className={inputCls} />
                                        </Field>
                                        <Field label="Graduation Year">
                                            <input type="text" value={editForm.graduation_year} onChange={e => setEditForm({ ...editForm, graduation_year: e.target.value })} placeholder="e.g. 2026" maxLength={4} className={inputCls} />
                                        </Field>
                                        <Field label="College Email">
                                            <input type="email" value={editForm.college_email} onChange={e => setEditForm({ ...editForm, college_email: e.target.value })} placeholder="you@college.edu" className={inputCls} />
                                        </Field>
                                        <Field label="Current year of college">
                                            <input type="number" min={1} max={5} value={editForm.experience_years} onChange={e => setEditForm({ ...editForm, experience_years: e.target.value })} placeholder="e.g. 3" className={inputCls} />
                                        </Field>
                                    </div>
                                </FieldGroup>

                                <Field label="Bio / About Me">
                                    <textarea rows={4} value={editForm.bio} onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                                        placeholder="Tell students about yourself, your rank, experience, what you can help with…"
                                        className={`${inputCls} resize-y`} />
                                </Field>

                                <Field label="Titles / Achievements" hint="Comma-separated">
                                    <input type="text" value={editForm.titles} onChange={e => setEditForm({ ...editForm, titles: e.target.value })} placeholder="e.g. JEE AIR 500, Coding Club Lead" className={inputCls} />
                                </Field>

                                <Field label="Hourly Rate (₹)" hint="Set 0 for free sessions">
                                    <input type="number" min={0} step={50} value={editForm.hourly_rate} onChange={e => setEditForm({ ...editForm, hourly_rate: e.target.value })} placeholder="e.g. 500" className={inputCls} />
                                </Field>

                                <FieldGroup label="Social Links">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field label="LinkedIn">
                                            <input type="text" value={editForm.linkedin_url} onChange={e => setEditForm({ ...editForm, linkedin_url: e.target.value })} placeholder="linkedin.com/in/username" className={inputCls} />
                                        </Field>
                                        <Field label="GitHub">
                                            <input type="text" value={editForm.github_url} onChange={e => setEditForm({ ...editForm, github_url: e.target.value })} placeholder="github.com/username" className={inputCls} />
                                        </Field>
                                    </div>
                                </FieldGroup>

                                <FieldGroup label="Areas of Expertise">
                                    <div
                                        className="flex flex-wrap gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus-within:border-primary transition-colors min-h-[48px] cursor-text"
                                        onClick={() => (document.getElementById('expertise-input') as HTMLInputElement)?.focus()}
                                    >
                                        {(editForm.specializations ?? []).map((tag: string) => (
                                            <span key={tag} className="flex items-center gap-1 px-2.5 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-bold rounded-full border border-teal-200 dark:border-teal-800">
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); setEditForm(prev => ({ ...prev, specializations: prev.specializations.filter((t: string) => t !== tag) })); }}
                                                    className="ml-0.5 text-teal-500 hover:text-teal-700 dark:hover:text-teal-200 leading-none"
                                                >×</button>
                                            </span>
                                        ))}
                                        <input
                                            id="expertise-input"
                                            type="text"
                                            value={expertiseInput}
                                            placeholder={(editForm.specializations?.length ?? 0) === 0 ? "Type a topic and press Enter…" : "Add more…"}
                                            className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder-slate-400"
                                            onChange={e => setExpertiseInput(e.target.value)}
                                            onKeyDown={e => {
                                                const val = expertiseInput.trim().replace(/,$/, '');
                                                if ((e.key === 'Enter' || e.key === ',') && val) {
                                                    e.preventDefault();
                                                    if (!editForm.specializations?.includes(val)) {
                                                        setEditForm(prev => ({ ...prev, specializations: [...(prev.specializations ?? []), val] }));
                                                    }
                                                    setExpertiseInput('');
                                                } else if (e.key === 'Backspace' && !expertiseInput && editForm.specializations?.length > 0) {
                                                    setEditForm(prev => ({ ...prev, specializations: prev.specializations.slice(0, -1) }));
                                                }
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1.5">Press <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[10px] font-mono">Enter</kbd> or <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[10px] font-mono">,</kbd> to add a topic</p>
                                </FieldGroup>

                                <FieldGroup label="Languages">
                                    <div className="flex flex-wrap gap-2">
                                        {LANGUAGE_OPTIONS.map(opt => (
                                            <button key={opt} type="button" onClick={() => toggleArrayItem("languages", opt)}
                                                className={`px-3 py-2 rounded-full text-xs font-bold transition-all border ${editForm.languages?.includes(opt) ? "bg-primary text-white border-primary shadow-sm" : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary/50"}`}>
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </FieldGroup>

                                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl">
                                    <Field label="Aadhaar Number" hint="Private — for verification only">
                                        <input type="text" value={editForm.aadhaar_number} onChange={e => setEditForm({ ...editForm, aadhaar_number: e.target.value })}
                                            placeholder="12-digit Aadhaar number" maxLength={12}
                                            className="w-full p-3 rounded-xl border border-amber-200 dark:border-amber-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-400 transition-colors text-sm" />
                                    </Field>
                                </div>

                                {saveError && (
                                    <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">⚠ {saveError}</p>
                                )}
                            </div>

                            <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsEditing(false)}
                                    className="px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving}
                                    className="px-6 py-2.5 rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:opacity-90 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center gap-2 text-sm">
                                    {saving ? <><span className="material-symbols-outlined text-sm animate-spin">progress_activity</span> Saving…</> : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Micro-components ─────────────────────────────────────────────────────────

function StatChip({ icon, value, label }: { icon: string; value: string; label: string }) {
    return (
        <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs">
            <span className="material-symbols-outlined text-primary text-[15px]">{icon}</span>
            <span className="font-bold text-slate-700 dark:text-slate-200">{value}</span>
            {label && <span className="text-slate-400">{label}</span>}
        </span>
    );
}

function SocialBtn({ href, title, color, children }: { href: string; title: string; color: string; children: React.ReactNode }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" title={title}
            className={`w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 ${color} hover:bg-slate-50 dark:hover:bg-slate-700 transition-all`}>
            {children}
        </a>
    );
}

function ContactRow({ icon, value }: { icon: string; value: string }) {
    return (
        <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[16px]">{icon}</span>
            </div>
            <span className="opacity-90 truncate">{value}</span>
        </div>
    );
}

const inputCls = "w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-primary transition-colors text-sm";

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">{label}</h4>
            {children}
        </div>
    );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {label}
                <span className="text-red-500 ml-1">*</span>
                {hint && <span className="ml-1.5 text-xs text-slate-400 font-normal">({hint})</span>}
            </label>
            {children}
        </div>
    );
}
