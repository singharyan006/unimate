"use client";

interface SuccessModalProps {
    onClose: () => void;
    consultantName: string;
}

export function SuccessModal({ onClose, consultantName }: SuccessModalProps) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 text-center border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 dark:text-green-400">
                    <span className="material-icons-outlined text-4xl">check_circle</span>
                </div>

                <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
                    Booking Confirmed!
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8">
                    You are scheduled with <span className="font-bold text-slate-700 dark:text-slate-300">{consultantName}</span>. Check your dashboard for details.
                </p>

                <button
                    onClick={onClose}
                    className="w-full py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90 transition-opacity"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}
