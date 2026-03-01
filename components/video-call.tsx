'use client';

import { JitsiMeeting } from '@jitsi/react-sdk';
import { useState } from 'react';

interface VideoCallProps {
    roomName: string;
    userName?: string;
    startWithAudioMuted?: boolean;
    startWithVideoMuted?: boolean;
    onLeave?: () => void;
}

export default function VideoCall({
    roomName,
    userName,
    startWithAudioMuted = false,
    startWithVideoMuted = false,
    onLeave
}: VideoCallProps) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="relative h-full w-full bg-slate-950 flex flex-col">
            {/* Loading overlay */}
            {isLoading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950 text-white gap-5">
                    {/* Animated ring */}
                    <div className="relative flex items-center justify-center">
                        <div className="absolute w-20 h-20 rounded-full bg-primary/20 animate-ping" />
                        <div className="absolute w-14 h-14 rounded-full bg-primary/10 animate-pulse" />
                        <div className="w-16 h-16 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        <span className="absolute material-icons-outlined text-primary text-2xl">video_call</span>
                    </div>
                    <div className="text-center">
                        <h2 className="text-xl font-black mb-1">Connecting you in...</h2>
                        <p className="text-slate-400 text-sm">Setting up a secure, encrypted channel</p>
                    </div>
                    {/* Animated dots */}
                    <div className="flex gap-1.5 mt-2">
                        {[0, 1, 2].map(i => (
                            <div
                                key={i}
                                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                                style={{ animationDelay: `${i * 0.15}s` }}
                            />
                        ))}
                    </div>
                </div>
            )}

            <JitsiMeeting
                domain="meet.jit.si"
                roomName={roomName}
                configOverwrite={{
                    startWithAudioMuted,
                    startWithVideoMuted,
                    disableThirdPartyRequests: true,
                    prejoinPageEnabled: false,
                    backgroundAlpha: 0,
                }}
                interfaceConfigOverwrite={{
                    disableDeepLinking: true,
                    MOBILE_APP_PROMO: false,
                    TOOLBAR_BUTTONS: [
                        'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                        'fodeviceselection', 'hangup', 'chat', 'recording',
                        'sharedvideo', 'settings', 'raisehand',
                        'videoquality', 'filmstrip', 'invite', 'stats',
                        'tileview', 'videobackgroundblur', 'help', 'mute-everyone',
                    ],
                    DEFAULT_BACKGROUND: '#020617',
                    DEFAULT_LOCAL_DISPLAY_NAME: 'Me',
                }}
                userInfo={{
                    displayName: userName || 'UniMate User',
                    email: 'user@unimate.io'
                }}
                onApiReady={(externalApi) => {
                    setIsLoading(false);
                    externalApi.addListener('videoConferenceLeft', () => {
                        onLeave?.();
                    });
                }}
                getIFrameRef={(iframeRef) => {
                    iframeRef.style.height = '100%';
                    iframeRef.style.width = '100%';
                    iframeRef.style.border = 'none';
                    iframeRef.style.background = '#020617';
                }}
            />
        </div>
    );
}
