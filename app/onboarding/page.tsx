"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Validation Schemas
const studentSchema = z.object({
    phoneNumber: z.string().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
    stream: z.string().min(1, "Please select a stream"),
    schoolName: z.string().min(2, "School name is required"),
    schoolCity: z.string().min(2, "School city is required"),
});

const consultantSchema = z.object({
    phoneNumber: z.string().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
});

type OnboardingFormData = {
    phoneNumber: string;
    stream?: string;
    schoolName?: string;
    schoolCity?: string;
};

export default function Onboarding() {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const router = useRouter();

    const [step, setStep] = useState(0);
    const [role, setRole] = useState<"student" | "consultant" | null>(null);
    const [loading, setLoading] = useState(false);

    // Redirect to dashboard if the user already has a role
    useEffect(() => {
        if (isLoaded && user) {
            const currentRole = user.unsafeMetadata.role as string;
            if (currentRole === "student") router.push("/dashboard");
            else if (currentRole === "consultant") router.push("/consultant");
        }
    }, [isLoaded, user, router]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<OnboardingFormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(role === "consultant" ? consultantSchema : studentSchema) as any,
        mode: "onChange",
    });

    const streamOptions = [
        "PCM (Physics, Chemistry, Math)",
        "PCB (Physics, Chemistry, Biology)",
        "Commerce",
        "Arts/Humanities",
        "Other",
    ];

    const onSubmit = async (data: OnboardingFormData) => {
        if (!user || !role) return;
        setLoading(true);

        const execute = async (token: string) => {
            const supabase = createClient(token);
            const formattedPhone = `+91${data.phoneNumber}`;

            // 1. Update Clerk Metadata (Only once, if it fails here we stop)
            await user.update({ unsafeMetadata: { role } });

            // 2. Upsert into profiles table
            const { error: profileError } = await supabase.from("profiles").upsert({
                id: user.id,
                email: user.emailAddresses[0].emailAddress,
                full_name: user.fullName,
                avatar_url: user.imageUrl,
                role,
                phone_number: formattedPhone,
            });
            if (profileError) throw profileError;

            // 3. Role-specific row
            if (role === "consultant") {
                const { error: consultantError } = await supabase.from("consultants").upsert({
                    id: user.id,
                    verified: false,
                    hourly_rate: 0,
                });
                if (consultantError) throw consultantError;
                router.push("/consultant");
            } else if (role === "student") {
                const { error: studentError } = await supabase.from("students").upsert({
                    id: user.id,
                    stream: data.stream,
                    school_name: data.schoolName,
                    school_city: data.schoolCity,
                });
                if (studentError) throw studentError;
                router.push("/dashboard");
            }
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
            console.error("Onboarding error:", err);
            const errorObj = err as { message?: string };
            alert("Onboarding failed: " + (errorObj.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    if (!isLoaded || !user) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background-light dark:bg-background-dark p-4 transition-colors duration-300">
            {/* Background Orbs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
            </div>

            {/* Main Container */}
            <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-3xl shadow-xl shadow-primary/5 hover:shadow-2xl transition-shadow duration-500 border border-slate-100 dark:border-slate-700">

                {/* Brand Header */}
                <div className="flex justify-center mb-6">
                    <Link href="/" className="inline-flex items-center gap-2.5 group transition-all hover:opacity-80">
                        <Image
                            src="/unimate.png"
                            alt="UniMate"
                            width={40}
                            height={40}
                            className="rounded-full object-cover group-hover:rotate-12 transition-transform duration-500"
                        />
                        <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">UniMate</span>
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
                        {step === 0 ? "Welcome to UniMate" : "Tell us a bit more"}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        {step === 0
                            ? "Choose your path to get started."
                            : role === "student"
                                ? "Complete your profile to find the best mentors."
                                : "Just one step and you're in!"}
                    </p>
                </div>

                {/* STEP 0: Role Selection */}
                {step === 0 && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <button
                                onClick={() => setRole("student")}
                                className={`p-8 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-5 text-center group ${role === "student"
                                    ? "border-primary bg-primary/5 shadow-xl shadow-primary/10 ring-4 ring-primary/10 scale-[1.02]"
                                    : "border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:border-primary/50 hover:shadow-md"
                                    }`}
                            >
                                <div className="relative w-24 h-24 rounded-full transition-all duration-300">
                                    <Image
                                        src="https://api.dicebear.com/9.x/notionists/svg?seed=Aneka&backgroundColor=ede9fe"
                                        alt="Student avatar"
                                        fill
                                        className="rounded-full object-cover"
                                    />
                                </div>
                                <div className="space-y-1.5 mt-2">
                                    <span className="block font-bold text-slate-800 dark:text-white text-xl">I&apos;m a Student</span>
                                    <span className="block text-sm text-slate-500 dark:text-slate-400">Looking for college guidance &amp; mentorship.</span>
                                </div>
                            </button>

                            <button
                                onClick={() => setRole("consultant")}
                                className={`p-8 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-5 text-center group ${role === "consultant"
                                    ? "border-primary bg-primary/5 shadow-xl shadow-primary/10 ring-4 ring-primary/10 scale-[1.02]"
                                    : "border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:border-primary/50 hover:shadow-md"
                                    }`}
                            >
                                <div className="relative w-24 h-24 rounded-full transition-all duration-300">
                                    <Image
                                        src="https://api.dicebear.com/9.x/notionists/svg?seed=Felix&backgroundColor=e0f2fe"
                                        alt="Consultant avatar"
                                        fill
                                        className="rounded-full object-cover"
                                    />
                                </div>
                                <div className="space-y-1.5 mt-2">
                                    <span className="block font-bold text-slate-800 dark:text-white text-xl">I&apos;m a Consultant</span>
                                    <span className="block text-sm text-slate-500 dark:text-slate-400">Share your experience and guide students.</span>
                                </div>
                            </button>
                        </div>

                        <button
                            onClick={() => { if (role) setStep(1); }}
                            disabled={!role}
                            className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            Continue
                        </button>
                    </div>
                )}

                {/* STEP 1: Details Form */}
                {step === 1 && (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="space-y-5">

                            {/* Phone Number — common to both */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 text-slate-500 dark:text-slate-400 font-medium select-none pointer-events-none">+91</span>
                                    <input
                                        type="tel"
                                        maxLength={10}
                                        placeholder="99999 99999"
                                        {...register("phoneNumber")}
                                        className={`w-full p-3.5 pl-14 rounded-xl border bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.phoneNumber ? "border-red-500" : "border-slate-200 dark:border-slate-700 focus:border-primary"}`}
                                    />
                                </div>
                                {errors.phoneNumber && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.phoneNumber.message as string}</p>}
                            </div>

                            {/* Student-specific */}
                            {role === "student" && (
                                <>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Stream</label>
                                        <select
                                            {...register("stream")}
                                            className={`w-full p-3.5 rounded-xl border bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none ${errors.stream ? "border-red-500" : "border-slate-200 dark:border-slate-700 focus:border-primary"}`}
                                        >
                                            <option value="">Select Stream</option>
                                            {streamOptions.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                        {errors.stream && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.stream.message as string}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">School Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. DPS RK Puram"
                                                {...register("schoolName")}
                                                className={`w-full p-3.5 rounded-xl border bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.schoolName ? "border-red-500" : "border-slate-200 dark:border-slate-700 focus:border-primary"}`}
                                            />
                                            {errors.schoolName && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.schoolName.message as string}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">School City</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. New Delhi"
                                                {...register("schoolCity")}
                                                className={`w-full p-3.5 rounded-xl border bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.schoolCity ? "border-red-500" : "border-slate-200 dark:border-slate-700 focus:border-primary"}`}
                                            />
                                            {errors.schoolCity && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.schoolCity.message as string}</p>}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Consultant placeholder */}
                            {role === "consultant" && (
                                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                                    <span className="material-symbols-outlined text-4xl text-primary mb-3">account_circle</span>
                                    <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Almost there!</h4>
                                    <p className="text-sm text-slate-500 max-w-sm mx-auto">
                                        You&apos;ll complete your full profile (university, bio, expertise) right after signing in from your dashboard.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={() => setStep(0)}
                                className="px-6 py-4 rounded-xl font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-4 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                            >
                                {loading ? "Setting up your profile..." : "Complete Setup"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
