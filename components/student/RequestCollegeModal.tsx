"use client";

import { useState } from "react";

interface RequestCollegeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function RequestCollegeModal({ isOpen, onClose }: RequestCollegeModalProps) {
    const [collegeName, setCollegeName] = useState("");
    const [collegeLocation, setCollegeLocation] = useState("");
    const [branch, setBranch] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    if (!isOpen) return null;

    const handleClose = () => {
        setSubmitted(false);
        setCollegeName("");
        setCollegeLocation("");
        setBranch("");
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSending(false);
        setSubmitted(true);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                        {submitted ? "Request Sent!" : "Request a College"}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <span className="material-icons-outlined text-slate-500 text-lg">close</span>
                    </button>
                </div>

                {/* Body */}
                {submitted ? (
                    /* ── Success State ── */
                    <div className="flex flex-col items-center gap-5 px-6 py-10 text-center">
                        <div className="w-20 h-20 rounded-full bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 flex items-center justify-center">
                            <span className="material-icons-outlined text-green-500 text-4xl">check_circle</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-1">
                                We&apos;ve got your request!
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                Your request for <span className="font-bold text-primary">{collegeName}</span> in{" "}
                                <span className="font-bold text-slate-600 dark:text-slate-200">{collegeLocation}</span>{" "}
                                for <span className="font-bold text-primary">{branch || "any branch"}</span> has been sent to our team.
                                We&apos;ll reach out via email once mentors from this college are onboarded.
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="mt-2 w-full h-12 bg-primary text-white rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    /* ── Form State ── */
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                                College Name
                            </label>
                            <input
                                type="text"
                                required
                                value={collegeName}
                                onChange={(e) => setCollegeName(e.target.value)}
                                placeholder="e.g. IIT Bombay"
                                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-slate-900 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                                Location
                            </label>
                            <input
                                type="text"
                                required
                                value={collegeLocation}
                                onChange={(e) => setCollegeLocation(e.target.value)}
                                placeholder="e.g. Mumbai, Maharashtra"
                                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-slate-900 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                                Branch / Major
                            </label>
                            <input
                                type="text"
                                required
                                value={branch}
                                onChange={(e) => setBranch(e.target.value)}
                                placeholder="e.g. Computer Science"
                                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-slate-900 dark:text-white"
                            />
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed">
                            We&apos;ll review your request and try to onboard mentors from this college soon. You&apos;ll hear from us via email.
                        </p>

                        <button
                            type="submit"
                            disabled={isSending}
                            className="mt-2 h-12 w-full bg-primary text-white rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSending ? (
                                <>
                                    <span className="material-icons-outlined animate-spin text-lg">sync</span>
                                    Sending Request...
                                </>
                            ) : (
                                <>
                                    <span className="material-icons-outlined text-lg">send</span>
                                    Send Request
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
