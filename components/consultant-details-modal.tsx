"use client";

interface ConsultantDetailsModalProps {
    consultant: {
        id: string;
        profiles?: { full_name: string | null; avatar_url: string | null } | null;
        university: string | null;
        major: string | null;
        bio: string | null;
        specializations: string[] | null;
        github_url: string | null;
        linkedin_url: string | null;
        college_email: string | null;
        hourly_rate: number | null;
        graduation_year: string | null;
    };
    onClose: () => void;
    onBook?: () => void;
}

export function ConsultantDetailsModal({ consultant, onClose, onBook }: ConsultantDetailsModalProps) {
    const FALLBACK_AVATAR = "https://api.dicebear.com/9.x/notionists/svg?seed=Felix&backgroundColor=e0f2fe";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header Profile Section */}
                <div className="relative h-32 bg-primary/10">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-white dark:bg-slate-900/50 dark:hover:bg-slate-900 rounded-full backdrop-blur-md transition-all text-slate-700 dark:text-slate-300"
                    >
                        <span className="material-symbols-outlined text-sm font-bold">close</span>
                    </button>

                    <div className="absolute -bottom-12 left-6">
                        <div
                            className="w-24 h-24 rounded-2xl bg-cover bg-center border-4 border-white dark:border-slate-900 shadow-lg"
                            style={{ backgroundImage: `url('${consultant.profiles?.avatar_url || FALLBACK_AVATAR}')` }}
                        />
                    </div>
                </div>

                {/* Details Body */}
                <div className="pt-16 pb-6 px-6">
                    <div className="mb-6">
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
                            {consultant.profiles?.full_name || "Consultant"}
                        </h2>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            {consultant.university && (
                                <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-widest border border-primary/20">
                                    {consultant.university}
                                </span>
                            )}
                            {consultant.major && (
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                                    {consultant.major}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-4 text-sm font-bold text-slate-600 dark:text-slate-300">
                            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                                <span className="material-symbols-outlined text-sm text-amber-500">payments</span>
                                <span>{(consultant.hourly_rate ?? 0) === 0 ? "Free" : `₹${consultant.hourly_rate} / hr`}</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                                <span className="material-symbols-outlined text-sm text-primary">school</span>
                                <span>{consultant.graduation_year ? `Class of ${consultant.graduation_year}` : "Graduation Year N/A"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6 space-y-4">
                        <div>
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">About</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                {consultant.bio || <span className="italic opacity-50">No bio added yet.</span>}
                            </p>
                        </div>

                        {consultant.specializations && consultant.specializations.length > 0 && (
                            <div>
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Specializations</h3>
                                <div className="flex flex-wrap gap-2">
                                    {consultant.specializations.map((tag: string) => (
                                        <span key={tag} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl font-bold">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                        {consultant.linkedin_url && (
                            <a
                                href={consultant.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex justify-center items-center gap-2 bg-[#0077b5]/10 hover:bg-[#0077b5] text-[#0077b5] hover:text-white font-bold py-3.5 px-4 rounded-xl transition-all text-sm border border-[#0077b5]/20"
                            >
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                LinkedIn
                            </a>
                        )}
                        {consultant.github_url && (
                            <a
                                href={consultant.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex justify-center items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-white text-slate-700 dark:text-slate-300 hover:text-white dark:hover:text-slate-900 font-bold py-3.5 px-4 rounded-xl transition-all text-sm border border-slate-200 dark:border-slate-700"
                            >
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                GitHub
                            </a>
                        )}
                        {!consultant.linkedin_url && !consultant.github_url && (
                            <a
                                href={`mailto:${consultant.college_email || ""}`}
                                className="flex-1 text-center bg-primary text-white font-bold py-3.5 px-4 rounded-xl transition-all text-sm border border-primary/20 shadow-lg shadow-primary/20 hover:opacity-90"
                            >
                                Send Email
                            </a>
                        )}
                        {onBook && (
                            <button
                                onClick={() => {
                                    onClose();
                                    onBook();
                                }}
                                className="flex-1 text-center bg-primary text-white font-bold py-3.5 px-4 rounded-xl transition-all text-sm border border-primary/20 shadow-lg shadow-primary/20 hover:opacity-90 cursor-pointer"
                            >
                                Book Session
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
