'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import VideoCall from '@/components/video-call'; // Assuming usage of lower-cased filename based on previous steps
import { useEffect, useState, Suspense } from 'react';

function SessionContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const roomName = searchParams.get('room');
    const userName = searchParams.get('user') || 'Guest';

    if (!roomName) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">No Room Name Provided</h1>
                    <button
                        onClick={() => router.back()}
                        className="text-primary hover:underline"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen w-screen bg-black">
            <VideoCall
                roomName={roomName}
                userName={userName}
                onLeave={() => router.back()}
            />
        </div>
    );
}

export default function SessionPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading session...</div>}>
            <SessionContent />
        </Suspense>
    )
}
