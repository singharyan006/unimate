'use client';

import { JitsiMeeting } from '@jitsi/react-sdk';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface VideoCallProps {
    roomName: string;
    userName?: string;
    onLeave?: () => void;
}

export default function VideoCall({ roomName, userName, onLeave }: VideoCallProps) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="relative h-full w-full bg-slate-950 flex flex-col">
            {isLoading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950 text-white">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
                        <Loader2 className="relative h-12 w-12 animate-spin text-primary mb-4" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight mb-2">Joining Session...</h2>
                    <p className="text-slate-400 text-sm">Securing your connection to the classroom</p>
                </div>
            )}

            <JitsiMeeting
                domain="meet.jit.si"
                roomName={roomName}
                configOverwrite={{
                    startWithAudioMuted: false,
                    disableThirdPartyRequests: true,
                    prejoinPageEnabled: false,
                    startWithVideoMuted: false,
                    backgroundAlpha: 0,
                    theme: 'dark' // Experimental
                }}
                interfaceConfigOverwrite={{
                    disableDeepLinking: true,
                    MOBILE_APP_PROMO: false,
                    TOOLBAR_BUTTONS: [
                        'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                        'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                        'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                        'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
                        'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
                        'security'
                    ],
                    // Customize colors if possible via interfaceConfig, though limited in Jitsi SaaS
                    DEFAULT_BACKGROUND: '#020617',
                    DEFAULT_LOCAL_DISPLAY_NAME: 'Me',
                }}
                userInfo={{
                    displayName: userName || 'Univoice User',
                    email: 'user@univoice.io'
                }}
                onApiReady={(externalApi) => {
                    setIsLoading(false);
                    // Handle cleanup or events here if needed
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
