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
        <div className="relative h-[600px] w-full overflow-hidden rounded-xl bg-background border shadow-sm">
            {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 font-medium text-slate-600 dark:text-slate-300">Loading Meeting...</span>
                </div>
            )}

            <JitsiMeeting
                domain="meet.jit.si"
                roomName={roomName}
                configOverwrite={{
                    startWithAudioMuted: false,
                    disableThirdPartyRequests: true,
                    prejoinPageEnabled: false,
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
                }}
                userInfo={{
                    displayName: userName || 'Univoice User',
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
                }}
            />
        </div>
    );
}
