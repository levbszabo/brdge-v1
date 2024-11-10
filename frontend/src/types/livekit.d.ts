declare module '@livekit/components-react' {
    import { ReactNode } from 'react';

    export interface LiveKitRoomProps {
        className?: string;
        serverUrl: string;
        token: string;
        children?: ReactNode;
        connect?: boolean;
        onError?: (error: Error) => void;
    }

    export interface TrackReferenceOrPlaceholder {
        publication: any;
        participant: any;
    }

    export interface TranscriptionSegment {
        id: string;
        text: string;
        timestamp?: number;
        language?: string;
        startTime?: number;
        endTime?: number;
        final?: boolean;
    }

    export interface TranscriptionResult {
        segments: TranscriptionSegment[];
    }

    export const LiveKitRoom: React.FC<LiveKitRoomProps>;
    export const VideoTrack: React.FC<any>;
    export const TrackToggle: React.FC<any>;
    export const StartAudio: React.FC<any>;
    export const useLocalParticipant: () => { localParticipant: any; getTracks: () => any[] };
    export const useTrackTranscription: (track: any) => TranscriptionResult;
    export const useChat: () => any;
} 