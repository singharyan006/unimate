"use client";

import { useState } from "react";

interface RequestCollegeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function RequestCollegeModal({ isOpen, onClose }: RequestCollegeModalProps) {
    const [collegeName, setCollegeName] = useState("");
    const [collegeLocation, setCollegeLocation] = useState("");
    const [isSending, setIsSending] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);

        // Simulate API call/Email sending
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Use mailto as a fallback/actual action if no backend
        // window.location.href = `mailto:admin@univoice.io?subject=New College Request: ${collegeName}&body=College Name: ${collegeName}%0D%0ALocation: ${collegeLocation}`;

        alert(`Request for "${collegeName}" in "${collegeLocation}" has been sent to our team!`);

        setIsSending(false);
        setCollegeName("");
        setCollegeLocation("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md p-6 shadow-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Request a College</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <span className="material-icons-outlined text-slate-500">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">College Name</label>
                        <input
                            type="text"
                            required
                            value={collegeName}
                            onChange={(e) => setCollegeName(e.target.value)}
                            placeholder="e.g. Stanford University"
                            className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Location</label>
                        <input
                            type="text"
                            required
                            value={collegeLocation}
                            onChange={(e) => setCollegeLocation(e.target.value)}
                            placeholder="e.g. California, USA"
                            className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                        />
                    </div>

                    <div className="mt-2 text-xs text-slate-400 leading-relaxed">
                        We'll review your request and try to onboard mentors from this college soon. You'll hear from us via email.
                    </div>

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
            </div>
        </div>
    );
}
