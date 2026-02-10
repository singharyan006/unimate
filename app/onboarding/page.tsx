"use client";

import { useUser, useSession } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
    university: z.string().min(2, "University name is required"),
    collegeCity: z.string().min(2, "College city/campus is required"), // New Field
    major: z.string().min(2, "Major/Degree is required"),
    gradYear: z.string().regex(/^\d{4}$/, "Year must be 4 digits (e.g. 2025)"),
    collegeEmail: z.string().email("Invalid email address"),
    linkedin: z.string().min(3, "LinkedIn username/slug is required"),
    specializations: z.array(z.string()).min(1, "Select at least one area of expertise"),
    aadhaarNumber: z.string().regex(/^[0-9]{12}$/, "Aadhaar number must be exactly 12 digits"),
    bio: z.string().min(50, "Bio must be at least 50 characters long"),
    experience: z.coerce.number().min(0, "Experience must be 0 or more years"),
    languages: z.array(z.string()).min(1, "Select at least one language"),
    titles: z.string().optional(), // New Field (comma separated or similar)
});

type ConsultantData = z.infer<typeof consultantSchema>;
type StudentData = z.infer<typeof studentSchema>;
type FormData = ConsultantData | StudentData;

export default function Onboarding() {
    const { user, isLoaded } = useUser();
    const { session } = useSession();
    const router = useRouter();

    // Steps: 0 = Role Selection, 1 = Data Collection
    const [step, setStep] = useState(0);
    const [role, setRole] = useState<"student" | "consultant" | null>(null);
    const [loading, setLoading] = useState(false);

    // React Hook Form
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<any>({
        resolver: zodResolver(role === 'consultant' ? consultantSchema : studentSchema) as any,
        mode: "onChange",
        defaultValues: {
            specializations: [],
            languages: [],
            experience: 0
        }
    });

    const specializations = watch("specializations");
    const languages = watch("languages");

    const expertiseOptions = [
        "Admissions",
        "Fees & Scholarships",
        "Placements",
        "Campus Life",
        "Internships"
    ];

    const languageOptions = [
        "English",
        "Hindi",
        "Spanish",
        "French",
        "German",
        "Mandarin",
        "Regional Indian Languages"
    ];

    const streamOptions = [
        "PCM (Physics, Chemistry, Math)",
        "PCB (Physics, Chemistry, Biology)",
        "Commerce",
        "Arts/Humanities",
        "Other"
    ];

    const handleLanguageToggle = (option: string) => {
        const current = languages || [];
        if (current.includes(option)) {
            setValue("languages", current.filter((s: string) => s !== option), { shouldValidate: true });
        } else {
            setValue("languages", [...current, option], { shouldValidate: true });
        }
    };

    const handleExpertiseToggle = (option: string) => {
        const current = specializations || [];
        if (current.includes(option)) {
            setValue("specializations", current.filter((s: string) => s !== option), { shouldValidate: true });
        } else {
            setValue("specializations", [...current, option], { shouldValidate: true });
        }
    };

    const onSubmit = async (data: any) => {
        if (!user || !role) return;
        setLoading(true);

        try {
            const token = await session?.getToken({ template: 'supabase' });
            const supabase = createClient(token);

            // Combine Prefixes
            const formattedPhone = `+91${data.phoneNumber}`;
            const formattedLinkedIn = role === 'consultant' ? `https://www.linkedin.com/in/${data.linkedin}` : null;

            // 1. Update Clerk Metadata
            await user.update({
                unsafeMetadata: { role: role }
            });

            // 2. Upsert Profile (Common fields + Phone)
            const { error: profileError } = await supabase.from('profiles').upsert({
                id: user.id,
                email: user.emailAddresses[0].emailAddress,
                full_name: user.fullName,
                avatar_url: user.imageUrl,
                role: role,
                phone_number: formattedPhone
            });

            if (profileError) throw profileError;

            // 3. Role Specific Inserts
            if (role === 'consultant') {
                // Convert titles string to array if needed, or store as is if schema changed. 
                // Plan said titles array but form input might be simple. Let's assume array of strings for now.
                // If input is text, split by comma.
                const titlesArray = data.titles ? data.titles.split(',').map((t: string) => t.trim()).filter(Boolean) : [];

                const { error: consultantError } = await supabase.from('consultants').upsert({
                    id: user.id,
                    university: data.university,
                    college_city: data.collegeCity,
                    major: data.major,
                    graduation_year: data.gradYear,
                    linkedin_url: formattedLinkedIn,
                    college_email: data.collegeEmail,
                    specializations: data.specializations,
                    verified: false,
                    hourly_rate: 0, // Default free for now
                    aadhaar_number: data.aadhaarNumber,
                    bio: data.bio,
                    experience_years: data.experience,
                    languages: data.languages,
                    titles: titlesArray
                });

                if (consultantError) throw consultantError;
            } else if (role === 'student') {
                const { error: studentError } = await supabase.from('students').upsert({
                    id: user.id,
                    stream: data.stream,
                    school_name: data.schoolName,
                    school_city: data.schoolCity
                });

                if (studentError) throw studentError;
            }

            // 4. Redirect
            if (role === 'student') router.push('/dashboard');
            else router.push('/consultant');

        } catch (err: any) {
            console.error("Onboarding Error", err);
            // Show specific error to user
            alert(`Failed to save profile: ${err.message || "Unknown error"}`);
        } finally {
            setLoading(false);
        }
    };

    if (!isLoaded || !user) return <div className="flex h-screen items-center justify-center">Loading...</div>;

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-950 p-4">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">

                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">
                        {step === 0 ? "Welcome to UniMate!" : "Tell us a bit more"}
                    </h2>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                        {step === 0
                            ? "Choose your role to get started."
                            : role === 'student'
                                ? "Complete your profile to find the best mentors."
                                : "Setup your consultant profile to guide students."}
                    </p>

                </div>

                {/* STEP 0: Role Selection */}
                {step === 0 && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setRole("student")}
                                className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${role === "student"
                                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                    : "border-slate-200 dark:border-slate-800 hover:border-primary/50"
                                    }`}
                            >
                                <span className="material-icons-outlined text-4xl text-primary">school</span>
                                <span className="font-bold text-slate-800 dark:text-white">I'm a Student</span>
                            </button>

                            <button
                                onClick={() => setRole("consultant")}
                                className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${role === "consultant"
                                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                    : "border-slate-200 dark:border-slate-800 hover:border-primary/50"
                                    }`}
                            >
                                <span className="material-icons-outlined text-4xl text-primary">psychology</span>
                                <span className="font-bold text-slate-800 dark:text-white">I'm a Consultant</span>
                            </button>
                        </div>

                        <button
                            onClick={() => { if (role) setStep(1); }}
                            disabled={!role}
                            className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Continue
                        </button>
                    </div>
                )}

                {/* STEP 1: Details Form */}
                {step === 1 && (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

                        {/* Common / Student Fields */}
                        <div className="space-y-4">

                            {/* Phone Number - Common */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3 text-slate-500 font-medium select-none pointer-events-none">+91</span>
                                    <input
                                        type="tel"
                                        maxLength={10}
                                        placeholder="99999 99999"
                                        {...register("phoneNumber")}
                                        className={`w-full p-3 pl-12 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-primary/20 ${errors.phoneNumber ? "border-red-500" : "border-slate-200 dark:border-slate-800"}`}
                                    />
                                </div>
                                {errors.phoneNumber && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.phoneNumber.message}</p>}
                            </div>

                            {/* Student Specific Fields */}
                            {role === 'student' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Stream</label>
                                        <select
                                            {...register("stream")}
                                            className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-primary/20 ${errors.stream ? "border-red-500" : "border-slate-200 dark:border-slate-800"}`}
                                        >
                                            <option value="">Select Stream</option>
                                            {streamOptions.map(opt => (
                                                <option key={opt} value={opt} className="dark:bg-slate-900">{opt}</option>
                                            ))}
                                        </select>
                                        {errors.stream && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.stream.message}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">School Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. DPS RK Puram"
                                                {...register("schoolName")}
                                                className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-primary/20 ${errors.schoolName ? "border-red-500" : "border-slate-200 dark:border-slate-800"}`}
                                            />
                                            {errors.schoolName && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.schoolName.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">School City</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. New Delhi"
                                                {...register("schoolCity")}
                                                className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-primary/20 ${errors.schoolCity ? "border-red-500" : "border-slate-200 dark:border-slate-800"}`}
                                            />
                                            {errors.schoolCity && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.schoolCity.message}</p>}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Consultant Specific Fields */}
                            {role === 'consultant' && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Current College / University</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. IIT Delhi"
                                                {...register("university")}
                                                className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-primary/20 ${errors.university ? "border-red-500" : "border-slate-200 dark:border-slate-800"}`}
                                            />
                                            {errors.university && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.university.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">College City / Campus</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Hauz Khas, Delhi"
                                                {...register("collegeCity")}
                                                className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-primary/20 ${errors.collegeCity ? "border-red-500" : "border-slate-200 dark:border-slate-800"}`}
                                            />
                                            {errors.collegeCity && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.collegeCity.message}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Degree & Branch</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. B.Tech Computer Science"
                                                {...register("major")}
                                                className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-primary/20 ${errors.major ? "border-red-500" : "border-slate-200 dark:border-slate-800"}`}
                                            />
                                            {errors.major && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.major.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Graduation Year</label>
                                            <input
                                                type="text"
                                                placeholder="2025"
                                                maxLength={4}
                                                {...register("gradYear")}
                                                className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-primary/20 ${errors.gradYear ? "border-red-500" : "border-slate-200 dark:border-slate-800"}`}
                                            />
                                            {errors.gradYear && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.gradYear.message}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">College Email ID</label>
                                            <input
                                                type="email"
                                                placeholder="you@college.edu"
                                                {...register("collegeEmail")}
                                                className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-primary/20 ${errors.collegeEmail ? "border-red-500" : "border-slate-200 dark:border-slate-800"}`}
                                            />
                                            {errors.collegeEmail && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.collegeEmail.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Titles / Expertise</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. JEE Ranker, Coding Club Lead"
                                                {...register("titles")}
                                                className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-primary/20 ${errors.titles ? "border-red-500" : "border-slate-200 dark:border-slate-800"}`}
                                            />
                                            <p className="text-xs text-slate-400 mt-1">Comma separated</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Aadhaar Number</label>
                                            <input
                                                type="text"
                                                placeholder="12-digit Aadhaar Number"
                                                maxLength={12}
                                                {...register("aadhaarNumber")}
                                                className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-primary/20 ${errors.aadhaarNumber ? "border-red-500" : "border-slate-200 dark:border-slate-800"}`}
                                            />
                                            {// @ts-ignore
                                                errors.aadhaarNumber && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.aadhaarNumber.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Years of Experience</label>
                                            <input
                                                type="number"
                                                placeholder="0"
                                                min={0}
                                                {...register("experience")}
                                                className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-primary/20 ${errors.experience ? "border-red-500" : "border-slate-200 dark:border-slate-800"}`}
                                            />
                                            {errors.experience && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.experience.message}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Bio / About Me</label>
                                        <textarea
                                            placeholder="Tell us about yourself, your expertise, and how you can help students..."
                                            rows={4}
                                            {...register("bio")}
                                            className={`w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-primary/20 ${errors.bio ? "border-red-500" : "border-slate-200 dark:border-slate-800"}`}
                                        />
                                        <p className="text-xs text-slate-400 mt-1">Minimum 50 characters.</p>
                                        {errors.bio && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.bio.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Languages Spoken</label>
                                        <div className="flex flex-wrap gap-2">
                                            {languageOptions.map(opt => (
                                                <button
                                                    type="button"
                                                    key={opt}
                                                    onClick={() => handleLanguageToggle(opt)}
                                                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${languages?.includes(opt)
                                                        ? "bg-primary text-white border-primary"
                                                        : "bg-transparent border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary/50"
                                                        }`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                        {errors.languages && <p className="text-red-500 text-xs mt-2 font-semibold">{errors.languages.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">LinkedIn Profile</label>
                                        <div className="relative flex items-center">
                                            <span className="hidden sm:inline-block absolute left-3 text-slate-500 text-xs font-medium select-none pointer-events-none truncate max-w-[140px]">linkedin.com/in/</span>
                                            <input
                                                type="text"
                                                placeholder="username"
                                                {...register("linkedin")}
                                                className={`w-full p-3 pl-3 sm:pl-[110px] rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-primary/20 ${errors.linkedin ? "border-red-500" : "border-slate-200 dark:border-slate-800"}`}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">Enter your LinkedIn username/slug only.</p>
                                        {errors.linkedin && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.linkedin.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Areas of Expertise</label>
                                        <div className="flex flex-wrap gap-2">
                                            {expertiseOptions.map(opt => (
                                                <button
                                                    type="button"
                                                    key={opt}
                                                    onClick={() => handleExpertiseToggle(opt)}
                                                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${specializations?.includes(opt)
                                                        ? "bg-primary text-white border-primary"
                                                        : "bg-transparent border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary/50"
                                                        }`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                        {errors.specializations && <p className="text-red-500 text-xs mt-2 font-semibold">{errors.specializations.message}</p>}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => setStep(0)}
                                className="px-6 py-4 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-4 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50"
                            >
                                {loading ? "Setting up Profile..." : "Complete Setup"}
                            </button>
                        </div>
                    </form>
                )}

            </div>
        </div>
    );
}
