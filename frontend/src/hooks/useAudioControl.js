import { useEffect, useRef } from 'react';

export function useAudioControl() {
    const audioRef = useRef(null);

    useEffect(() => {
        return () => {
            // This cleanup function will run when the component unmounts
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    return audioRef;
}
