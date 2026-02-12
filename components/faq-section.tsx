"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = {
    students: [
        {
            question: "How do I know mentors will give honest advice and not just promote their college?",
            answer: "Mentors on UniMate are not incentivised to \"sell\" any college. Their role is to share real experiences — including negatives — so you can make an informed decision, not a promotional one."
        },
        {
            question: "What if the mentor’s experience is outdated?",
            answer: "Mentors on UniMate are currently studying in their colleges. The information you get reflects the present reality, not how things were years ago."
        },
        {
            question: "Is UniMate useful if I already read a lot of online reviews?",
            answer: "Online reviews tell you what people think. UniMate lets you ask why, how, and what really matters — in real time, based on your priorities."
        },
        {
            question: "What if I’m still confused even after a session?",
            answer: "You’re free to speak to multiple mentors from different colleges or branches until you feel confident. There’s no restriction to just one conversation."
        },
        {
            question: "What if the call is cut off midway?",
            answer: "If a session gets disconnected due to technical issues, don’t worry. We’ll look into it right away. If both the mentor and student are comfortable, the session can be rescheduled so the conversation continues smoothly. If rescheduling doesn’t work for either party, the session will be refunded without hassle."
        }
    ],
    parents: [
        {
            question: "Can parents be part of the conversation?",
            answer: "Yes. Parents are welcome to join or listen in during sessions if the student is comfortable. Many families find that hearing directly from a senior helps align expectations."
        },
        {
            question: "Why should we trust a student’s opinion for such an important decision?",
            answer: "Because students are the ones living the reality right now. They experience the academics, campus life, hostels, placements, and pressure firsthand — information that brochures and rankings often don’t show."
        }
    ]
};

export default function FAQSection() {
    const [activeTab, setActiveTab] = useState<'students' | 'parents'>('students');
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-24 bg-white dark:bg-slate-950 transition-colors">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                        Everything you need to know about how UniMate helps you make the best college decision.
                    </p>

                    {/* Toggle */}
                    <div className="inline-flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-full relative">
                        <div
                            className={`absolute inset-y-1.5 w-1/2 bg-white dark:bg-slate-800 rounded-full shadow-sm transition-all duration-300 ease-in-out ${activeTab === 'students' ? 'left-1.5' : 'left-[calc(50%-6px)] translate-x-1.5'
                                }`}
                        ></div>
                        <button
                            onClick={() => { setActiveTab('students'); setOpenIndex(0); }}
                            className={`relative px-8 py-2.5 rounded-full text-sm font-bold transition-colors z-10 w-40 ${activeTab === 'students'
                                ? 'text-slate-900 dark:text-white'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                        >
                            For Students
                        </button>
                        <button
                            onClick={() => { setActiveTab('parents'); setOpenIndex(0); }}
                            className={`relative px-8 py-2.5 rounded-full text-sm font-bold transition-colors z-10 w-40 ${activeTab === 'parents'
                                ? 'text-slate-900 dark:text-white'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                        >
                            For Parents
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4"
                        >
                            {FAQS[activeTab].map((faq, index) => (
                                <div
                                    key={index}
                                    className={`border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === index
                                        ? 'bg-white dark:bg-slate-900 shadow-lg ring-1 ring-primary/20'
                                        : 'bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900'
                                        }`}
                                >
                                    <button
                                        onClick={() => toggleAccordion(index)}
                                        className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none"
                                    >
                                        <span className={`text-lg font-bold ${openIndex === index ? 'text-primary' : 'text-slate-800 dark:text-white'}`}>
                                            {faq.question}
                                        </span>
                                        <span className={`material-icons-outlined transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-primary' : 'text-slate-400'}`}>
                                            expand_more
                                        </span>
                                    </button>
                                    <AnimatePresence>
                                        {openIndex === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                            >
                                                <div className="px-8 pb-8 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
