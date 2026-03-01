'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import VideoCall from '@/components/video-call';
import { Suspense, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

function SessionContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const roomName = searchParams.get('room');
    const userName = searchParams.get('user') || 'Guest';

    const [joined, setJoined] = useState(false);
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);

    if (!roomName) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                        <span className="material-icons-outlined text-red-400 text-3xl">link_off</span>
                    </div>
                    <h1 className="text-2xl font-bold">No Session Found</h1>
                    <p className="text-slate-400 text-sm">This session link is invalid or has expired.</p>
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!joined) {
        return (
            <div
                className="flex h-screen w-screen items-center justify-center bg-slate-950 relative overflow-hidden"
                style={{ fontFamily: "'Inter', sans-serif" }}
            >
                {/* Ambient glow blobs */}
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 w-full max-w-md mx-4">

                    {/* Brand */}
                    <Link href="/" className="flex items-center justify-center gap-2 mb-8 hover:opacity-80 transition-opacity">
                        <Image
                            src="/unimate.png"
                            alt="UniMate"
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                        <span className="text-white font-bold text-lg">UniMate</span>
                    </Link>

                    {/* Card */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold mb-4">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                Session Ready
                            </div>
                            <h1 className="text-2xl font-black text-white mb-2">Ready to join?</h1>
                            <p className="text-slate-400 text-sm">
                                Joining as <span className="text-white font-semibold">{userName}</span>
                            </p>
                        </div>

                        {/* Room info */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 mb-6 flex items-center gap-3">
                            <span className="material-icons-outlined text-primary text-lg">meeting_room</span>
                            <div className="min-w-0">
                                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Session Room</p>
                                <p className="text-white text-sm font-semibold truncate">{roomName}</p>
                            </div>
                        </div>

                        {/* Mic/Camera toggles */}
                        <div className="flex gap-3 mb-6">
                            <button
                                onClick={() => setMicOn(v => !v)}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all border ${micOn
                                    ? 'bg-white/10 border-white/10 text-white hover:bg-white/15'
                                    : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                                    }`}
                            >
                                <span className="material-icons-outlined text-base">
                                    {micOn ? 'mic' : 'mic_off'}
                                </span>
                                {micOn ? 'Mic On' : 'Mic Off'}
                            </button>
                            <button
                                onClick={() => setCamOn(v => !v)}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all border ${camOn
                                    ? 'bg-white/10 border-white/10 text-white hover:bg-white/15'
                                    : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                                    }`}
                            >
                                <span className="material-icons-outlined text-base">
                                    {camOn ? 'videocam' : 'videocam_off'}
                                </span>
                                {camOn ? 'Cam On' : 'Cam Off'}
                            </button>
                        </div>

                        {/* Join button */}
                        <button
                            onClick={() => setJoined(true)}
                            className="w-full h-13 py-3.5 bg-primary text-white rounded-2xl font-black text-base hover:opacity-90 hover:-translate-y-0.5 active:scale-95 transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2"
                        >
                            <span className="material-icons-outlined">video_call</span>
                            Join Session
                        </button>

                        <div className="mt-4 text-center">
                            <button
                                onClick={() => router.back()}
                                className="text-slate-500 hover:text-slate-300 text-xs font-medium transition-colors"
                            >
                                ← Leave &amp; go back
                            </button>
                        </div>
                    </div>

                    <p className="text-center text-slate-600 text-xs mt-6">
                        Powered by <span className="text-slate-500">Jitsi Meet</span> · End-to-end encrypted
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen bg-slate-950 flex flex-col">
            {/* Slim top bar */}
            <div className="flex items-center justify-between px-5 py-2.5 bg-slate-950/80 backdrop-blur-sm border-b border-white/5 z-10 shrink-0">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <Image
                        src="/unimate.png"
                        alt="UniMate"
                        width={24}
                        height={24}
                        className="rounded-full"
                    />
                    <span className="text-white font-bold text-sm">UniMate Session</span>
                </Link>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-green-400 text-xs font-bold">Live</span>
                    </div>
                </div>
            </div>

            {/* Video call */}
            <div className="flex-1 relative">
                <VideoCall
                    roomName={roomName}
                    userName={userName}
                    startWithAudioMuted={!micOn}
                    startWithVideoMuted={!camOn}
                    onLeave={() => router.back()}
                />
            </div>
        </div>
    );
}

export default function SessionPage() {
    return (
        <Suspense
            fallback={
                <div className="flex h-screen items-center justify-center bg-slate-950">
                    <div className="flex flex-col items-center gap-4 text-white">
                        <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-slate-400 text-sm">Loading session...</p>
                    </div>
                </div>
            }
        >
            <SessionContent />
        </Suspense>
    );
}
