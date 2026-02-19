"use client";
/* eslint-disable @next/next/no-img-element */

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import FAQSection from "@/components/faq-section";
import { motion } from "framer-motion";

const UNIVERSITIES = [
    { name: "VIT VELLORE", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Vellore_Institute_of_Technology_seal_2017.svg/1200px-Vellore_Institute_of_Technology_seal_2017.svg.png" },
    { name: "SRM IST CHENNAI", logo: "https://logodix.com/logo/1787040.png" },
    { name: "MANIPAL UNIVERSITY JAIPUR", logo: "https://www.google.com/s2/favicons?domain=jaipur.manipal.edu&sz=256" },
    { name: "UPES DEHRADUN", logo: "https://www.google.com/s2/favicons?domain=upes.ac.in&sz=256" },
    { name: "IIT MADRAS", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/69/IIT_Madras_Logo.svg/1200px-IIT_Madras_Logo.svg.png" },
    { name: "JAYPEE INSTITUTE OF TECHNOLOGY", logo: "https://www.google.com/s2/favicons?domain=jiit.ac.in&sz=256" },
    { name: "AMITY UNIVERSITY, NOIDA", logo: "https://amity.edu/images/logo.png" },
    { name: "JSS INSTITUTE NOIDA", logo: "https://www.google.com/s2/favicons?domain=jssaten.ac.in&sz=256" },
    { name: "DELHI TECHNICAL UNIVERSITY", logo: "https://upload.wikimedia.org/wikipedia/en/b/b5/DTU%2C_Delhi_official_logo.png" },
    { name: "BITS PILANI", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/BITS_Pilani-Logo.svg/1200px-BITS_Pilani-Logo.svg.png" }
];

export default function Home() {
    const { user, isSignedIn } = useUser();
    const router = useRouter();

    const handleSmartLogin = () => {
        if (!isSignedIn) {
            router.push('/sign-in');
            return;
        }

        const role = user?.unsafeMetadata?.role as string;
        if (!role) {
            router.push('/onboarding');
        } else if (role === 'student') {
            router.push('/dashboard');
        } else if (role === 'consultant') {
            router.push('/consultant');
        }
    };

    return (
        <>
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="material-icons-outlined text-primary text-3xl">
                            school
                        </span>
                        <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            UniMate
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 font-semibold text-slate-600 dark:text-slate-300">
                        <button
                            onClick={handleSmartLogin}
                            className="hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
                        >
                            Find Mentors
                        </button>
                        <button
                            onClick={handleSmartLogin}
                            className="hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
                        >
                            For Consultants
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        <Button onClick={handleSmartLogin}>
                            {isSignedIn ? "Go to Dashboard" : "Get Started"}
                        </Button>
                    </div>
                </div>
            </nav>

            <main className="pt-20">
                {/* Hero Section */}
                <section className="relative overflow-hidden py-24 lg:py-32">
                    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm tracking-wide">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                Explore Every Detail Before You Decide.
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-white">
                                Guidance from those <br />
                                <span className="text-primary italic">who live it</span>.
                            </h1>
                            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
                                Skip the guesswork. Connect with verified college students for
                                1:1 video sessions to get honest insights about your dream
                                campus and major.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button size="lg" className="hover:scale-105 shadow-xl shadow-primary/30" onClick={handleSmartLogin}>
                                    Browse Mentors
                                    <span className="material-icons-outlined ml-2">arrow_forward</span>
                                </Button>
                                <Button variant="outline" size="lg" asChild>
                                    <Link href="#how-it-works">How it works</Link>
                                </Button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                            <img
                                alt="Students collaborating"
                                className="rounded-2xl shadow-2xl relative z-10 border border-white/20"
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            />
                        </div>
                    </div>
                </section>

                {/* Top Universities Marquee Section */}
                <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="max-w-4xl mx-auto px-6 mb-16 text-center">
                        <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-primary to-slate-900 dark:from-white dark:via-primary dark:to-white">
                            Get insights from students at
                        </h2>
                        <div className="w-24 h-1.5 bg-primary/20 mx-auto rounded-full">
                            <div className="w-12 h-full bg-primary rounded-full"></div>
                        </div>
                    </div>
                    <div className="relative w-full">
                        {/* Gradient Masks for smooth fade on edges */}
                        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none"></div>

                        <div className="flex w-[200%] gap-8">
                            <motion.div
                                animate={{
                                    x: ["0%", "-50%"]
                                }}
                                transition={{
                                    repeat: Infinity,
                                    ease: "linear",
                                    duration: 40
                                }}
                                className="flex gap-12 whitespace-nowrap min-w-max items-center px-4"
                            >
                                {/* Render twice for seamless loop */}
                                {[...UNIVERSITIES, ...UNIVERSITIES].map((uni, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-4 hover:scale-105 transition-all duration-300"
                                    >
                                        <div className="w-32 h-32 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden p-1.5 shadow-sm">
                                            <img
                                                src={uni.logo}
                                                alt={`${uni.name} logo`}
                                                className="w-full h-full object-contain"
                                                loading="lazy"
                                                referrerPolicy="no-referrer"
                                            />
                                        </div>
                                        <span className="font-bold text-slate-800 dark:text-slate-200 text-lg tracking-wide">
                                            {uni.name}
                                        </span>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section
                    className="py-24 bg-slate-50 dark:bg-slate-900/50 transition-colors"
                    id="how-it-works"
                >
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white">
                                Get started in three easy steps
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400">
                                Choose a mentor from your target branch, book a live 1:1
                                session, and clear all your doubts first-hand.
                            </p>
                        </div>
                        <div className="grid lg:grid-cols-3 gap-8 relative">
                            {/* Step 1 */}
                            <div className="group bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700 relative">
                                <div className="absolute -right-8 top-1/2 -translate-y-1/2 hidden lg:block text-primary/30 scale-150">
                                    <svg
                                        fill="none"
                                        height="40"
                                        viewBox="0 0 60 40"
                                        width="60"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M2 10C15 2 45 2 58 20M58 20L48 18M58 20L52 28"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                        ></path>
                                    </svg>
                                </div>
                                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary text-white font-bold text-xs uppercase tracking-widest mb-8">
                                    Step 1
                                </div>
                                <h3 className="text-2xl font-bold mb-4 dark:text-white">
                                    Browse mentors
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                                    Filter through a diverse pool of mentors based on your dream
                                    college, major, and career interests.
                                </p>
                                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 overflow-hidden border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                            <span className="material-icons-outlined text-sm">
                                                search
                                            </span>
                                        </div>
                                        <div className="h-2 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-teal-100"></div>
                                            <div className="flex-1 space-y-1.5">
                                                <div className="h-2 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                                <div className="h-2 w-12 bg-slate-100 dark:bg-slate-700 rounded"></div>
                                            </div>
                                            <span className="material-icons-outlined text-primary">
                                                check_circle
                                            </span>
                                        </div>
                                        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm flex items-center gap-3 opacity-50">
                                            <div className="w-10 h-10 rounded-full bg-slate-100"></div>
                                            <div className="flex-1 space-y-1.5">
                                                <div className="h-2 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                                <div className="h-2 w-16 bg-slate-100 dark:bg-slate-700 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="group bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700 relative">
                                <div className="absolute -right-8 top-1/2 -translate-y-1/2 hidden lg:block text-primary/30 scale-150 rotate-12">
                                    <svg
                                        fill="none"
                                        height="40"
                                        viewBox="0 0 60 40"
                                        width="60"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M2 10C15 2 45 2 58 20M58 20L48 18M58 20L52 28"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                        ></path>
                                    </svg>
                                </div>
                                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary text-white font-bold text-xs uppercase tracking-widest mb-8">
                                    Step 2
                                </div>
                                <h3 className="text-2xl font-bold mb-4 dark:text-white">
                                    Book a 1:1 session
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                                    Pick a suitable time slot and book a live video or audio
                                    session that fits into your schedule.
                                </p>
                                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
                                    <div className="grid grid-cols-4 gap-2 mb-3">
                                        <div className="h-10 bg-primary/20 rounded border border-primary/20"></div>
                                        <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                        <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                        <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                        <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                        <div className="h-10 bg-primary rounded border border-primary flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                                        </div>
                                        <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <div className="h-8 w-24 bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center rounded uppercase tracking-wider">
                                            Confirmed
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="group bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700">
                                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary text-white font-bold text-xs uppercase tracking-widest mb-8">
                                    Step 3
                                </div>
                                <h3 className="text-2xl font-bold mb-4 dark:text-white">
                                    Get clarity
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                                    Clear up your doubts through a 1:1 conversation and get honest
                                    answers from a real senior.
                                </p>
                                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-700 relative overflow-hidden group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors">
                                    <div className="flex items-center justify-center gap-6 py-4">
                                        <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900 border-2 border-primary overflow-hidden">
                                            <img
                                                alt="Mentor"
                                                className="w-full h-full object-cover"
                                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mentor&backgroundColor=c0aede"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                            <div className="h-2 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                        </div>
                                        <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                            <img
                                                alt="Mentee"
                                                className="w-full h-full object-cover"
                                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mentee&backgroundColor=b6e3f4"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-center gap-2 mt-2">
                                        <span className="material-icons-outlined text-primary text-xl">
                                            videocam
                                        </span>
                                        <span className="material-icons-outlined text-primary text-xl">
                                            mic
                                        </span>
                                        <span className="material-icons-outlined text-primary text-xl">
                                            star
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <FAQSection />

                {/* CTA Section */}
                <section className="py-24">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="bg-primary rounded-[2.5rem] p-12 lg:p-20 text-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10 pointer-events-none">
                                <svg
                                    height="100%"
                                    preserveAspectRatio="none"
                                    viewBox="0 0 100 100"
                                    width="100%"
                                >
                                    <defs>
                                        <pattern
                                            height="10"
                                            id="grid"
                                            patternUnits="userSpaceOnUse"
                                            width="10"
                                        >
                                            <path
                                                d="M 10 0 L 0 0 0 10"
                                                fill="none"
                                                stroke="white"
                                                strokeWidth="0.5"
                                            ></path>
                                        </pattern>
                                    </defs>
                                    <rect fill="url(#grid)" height="100%" width="100%"></rect>
                                </svg>
                            </div>
                            <div className="relative z-10">
                                <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">
                                    Ready to make the right choice?
                                </h2>
                                <p className="text-white/80 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
                                    Join thousands of students who have found their perfect
                                    college path with UniMate.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Button variant="secondary" size="xl" asChild>
                                        <Link href="/dashboard">Find My Mentor</Link>
                                    </Button>
                                    <Button
                                        size="xl"
                                        className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10"
                                        asChild
                                    >
                                        <Link href="mailto:support@unimate.com">Contact Support</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-16 transition-colors">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-2 space-y-6">
                            <div className="flex items-center gap-2">
                                <span className="material-icons-outlined text-primary text-3xl">
                                    school
                                </span>
                                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                                    UniMate
                                </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 max-w-sm">
                                Empowering the next generation of college students through
                                authentic connections and peer mentorship.
                            </p>
                            <div className="flex gap-4">
                                <a
                                    className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white transition-all"
                                    href="#"
                                >
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.599 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                                    </svg>
                                </a>
                                <a
                                    className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white transition-all"
                                    href="#"
                                >
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm">
                                    Platform
                                </h4>
                                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                                    <li>
                                        <Link
                                            className="hover:text-primary transition-colors"
                                            href="/dashboard"
                                        >
                                            Find Mentors
                                        </Link>
                                    </li>
                                    <li>
                                        <a
                                            className="hover:text-primary transition-colors"
                                            href="#"
                                        >
                                            Pricing
                                        </a>
                                    </li>
                                    <li>
                                        <Link
                                            className="hover:text-primary transition-colors"
                                            href="/consultant"
                                        >
                                            Consultants
                                        </Link>
                                    </li>
                                    <li>
                                        <a
                                            className="hover:text-primary transition-colors"
                                            href="#"
                                        >
                                            Success Stories
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm">
                                    Legal
                                </h4>
                                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                                    <li>
                                        <a
                                            className="hover:text-primary transition-colors"
                                            href="#"
                                        >
                                            Privacy Policy
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="hover:text-primary transition-colors"
                                            href="#"
                                        >
                                            Terms of Service
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="hover:text-primary transition-colors"
                                            href="#"
                                        >
                                            Cookie Policy
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                        <p>© 2026 UniMate Inc. All rights reserved.</p>
                        <div className="flex gap-6">
                            <span className="flex items-center gap-1">
                                <span className="material-icons-outlined text-xs">
                                    language
                                </span>{" "}
                                English (US)
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="material-icons-outlined text-xs">
                                    payments
                                </span>{" "}
                                INR (₹)
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
