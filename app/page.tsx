"use client";
/* eslint-disable @next/next/no-img-element */

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

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
                        <a
                            className="hover:text-primary transition-colors"
                            href="#how-it-works"
                        >
                            How it works
                        </a>
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
                                TRUSTED BY 10,000+ STUDENTS
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
                            <div className="flex items-center gap-4 pt-4">
                                <div className="flex -space-x-3">
                                    <img
                                        alt="Student user"
                                        className="w-12 h-12 rounded-full border-4 border-background-light dark:border-background-dark object-cover"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeS5YHyLXX73mBV7QYSQTry6AkSUYV-WOiwBQMa08yPjSgvKmOtIF_xnxqZy5SdEg71mB-38AJ_pGShjFGiVJtCRvfUJBZ-XSKgwVLvtLAKVQtWnucTGXUhIBevD2zlA-BBwQsJWHgfYoDI1zT_hBi-QxhsWN9j1QYQGxaT9WANJrbN6fX9W1jtrT0BolSdLOsjeeKx4qEbnIAzxS4wrfyN3RyPNKqGNUt4Kh1yrFX0UMZrOhSIh-xxaOF8SGTRqq_hzURdRUEZJA"
                                    />
                                    <img
                                        alt="Student user"
                                        className="w-12 h-12 rounded-full border-4 border-background-light dark:border-background-dark object-cover"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxFw-y6M444uIvaWtPfru_vV9OvFRKU_cxPJN4zQ2961Ya5JQrzNsGSxsCDUkKAeMAcIrhG0S0ghT8shY9SLDoaskaWXHWmYp2Kfh-OzT810QqjLSk6xPBhclwjlniCXVmw25QPmjhA4etvWdJWMD0MYn-Vrqqv-kT5Qg7I8P5wdnIbEBLG7oQjfNV-9cGnK_spw-Gzs0BA3G2xoOdoXmudHNh5UsfblWHIQDms6CdH0TDCkK04E7FjeKvzx-cr55rrS9KA2whsYo"
                                    />
                                    <img
                                        alt="Student user"
                                        className="w-12 h-12 rounded-full border-4 border-background-light dark:border-background-dark object-cover"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCD7CDIIExUbeD211N996WRok70xgMVLAVFJRIQRpC5ilwR__Vg0zMWHWKMqjDUSEPUCMKiKW2IHglaafTYRVgaFWeoWSpOvBRR_6Yhu5QVrQdzqTucr5Dw0XaPTYWi4Qtu6t_tjDLBx8arRB--1dtRhxeRpZQH2Hwgz6LSiRj6sMFYVYQsBGP9tTvxKVI87RPJ8z5m8fDXTgwEgD3y8TVt42uZFid9yZWt0zUU8zgM4nOTHfFyYOJ2hH7mtH8_kk3Woqh1s_e-QaA"
                                    />
                                    <div className="w-12 h-12 rounded-full border-4 border-background-light dark:border-background-dark bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">
                                        +5k
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-500">
                                    Joined this week
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                            <img
                                alt="Students collaborating"
                                className="rounded-2xl shadow-2xl relative z-10 border border-white/20"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDp9eT3CiRvbTIdQBZ5PPAiDbf6hLYVDwFGu7BnlbOunS7Uv-80iGxGRRDcH-GhKEbC-fXK-dJupi_r_YhL1-cTMBq8Vu3LY45UEzmTyidsg6mnXAxq8cf7SNIXr99arffMTaG7OYyDjwAGXTeaeH5hl21l4bF4XzYJpBTn-DXxkRYo9edEJzsZQPqZlVPmgraHTeWjfRR0OokhPNYr-EY8tQYcy4ISw4rBYGjwT3W3eIgLYQCyJwhl2GYNN8G0uWhmo-8CiwgN7Wo"
                            />
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
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeU4zIl3sv-bEkExqyAiEyssE8PBm3alrmLgpLspsXlTWhXGN4ZwlAHww6Mdt1K5SvK3gOBHIrZs6Kg4w8ZESbs8KMMKVc03Wr4LIT0UOnKvEtBmd7CGHmXNKSTY-LSQrLDGqqoX15pvO-vgi8Qvc3yihRrJHYEHkNXHImeCI7zDb4FWFk98djXZ_L22lIId8bwyqU4vKKjCnCp25IjIef5CSMIe3-Azgigx8XmcOwk16TiGHXE1evVaDlBmvd5hCorTQREVYPed0"
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
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXKEyx392Kae76ADIKu3zJpTAkgcYnHyX-GZD0ZlUeT4tqLk4B0TTs4y5ZVhKNivzBEgyn9b-jrTP6RmcvERtbrBEgn6lhDty7aDcxZq9-x59bvspTlMAzJWdzPBj3J2chwRjcPirk4cg-yBHB7KnLVTwe2PzYlpzu9c_5PwK5yOQRiNEYcSJvAyKPr24uELwyYofpwEaUEWP76xojWpKg6fOfob1YVB0n6u5WmqJ1NxW8MprwXMBG-bKW6U6yBO0zR9XNa3g6lgY"
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
                        <p>© 2024 UniMate Inc. All rights reserved.</p>
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
