import { ChatTile } from "../components/chat/ChatTile";
import {
    useLocalParticipant,
    useTrackTranscription,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useCallback, useEffect, useMemo, useRef } from "react";

export const TranscriptionTile = ({ agentAudioTrack, accentColor }) => {
    const transcripts = useRef(new Map());
    const { localParticipant } = useLocalParticipant();
    const localTrack = localParticipant?.getTracks().find(
        track => track.source === Track.Source.Microphone
    );

    const agentMessages = useTrackTranscription(agentAudioTrack);
    const localMessages = useTrackTranscription(localTrack);

    const segmentToChatMessage = useCallback(
        (text, timestamp, isSelf) => ({
            name: isSelf ? "You" : "Agent",
            message: text,
            timestamp,
            isSelf,
        }),
        []
    );

    useEffect(() => {
        if (agentMessages?.segments) {
            agentMessages.segments.forEach((segment) =>
                transcripts.current.set(
                    segment.id,
                    segmentToChatMessage(
                        segment.text,
                        segment.timestamp || Date.now(),
                        false
                    )
                )
            );
        }
        if (localMessages?.segments) {
            localMessages.segments.forEach((segment) =>
                transcripts.current.set(
                    segment.id,
                    segmentToChatMessage(
                        segment.text,
                        segment.timestamp || Date.now(),
                        true
                    )
                )
            );
        }
    }, [agentMessages?.segments, localMessages?.segments, segmentToChatMessage]);

    const messages = useMemo(() => {
        return Array.from(transcripts.current.values()).sort(
            (a, b) => a.timestamp - b.timestamp
        );
    }, [transcripts.current]);

    return (
        <ChatTile
            messages={messages}
            accentColor={accentColor}
        />
    );
}; 