import { useEffect, useState } from "react";

export const useTrackVolume = (track) => {
    const [volume, setVolume] = useState(0);

    useEffect(() => {
        if (!track || !track.mediaStream) {
            return;
        }

        const ctx = new AudioContext();
        const source = ctx.createMediaStreamSource(track.mediaStream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 32;
        analyser.smoothingTimeConstant = 0;
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const updateVolume = () => {
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
                const a = dataArray[i];
                sum += a * a;
            }
            setVolume(Math.sqrt(sum / dataArray.length) / 255);
        };

        const interval = setInterval(updateVolume, 1000 / 30);

        return () => {
            source.disconnect();
            clearInterval(interval);
        };
    }, [track, track?.mediaStream]);

    return volume;
};

const normalizeFrequencies = (frequencies) => {
    const normalizeDb = (value) => {
        const minDb = -100;
        const maxDb = -10;
        let db = 1 - (Math.max(minDb, Math.min(maxDb, value)) * -1) / 100;
        db = Math.sqrt(db);
        return db;
    };

    return frequencies.map((value) => {
        if (value === -Infinity) {
            return 0;
        }
        return normalizeDb(value);
    });
};

export const useMultibandTrackVolume = (track, bands = 5, loPass = 100, hiPass = 600) => {
    const [frequencyBands, setFrequencyBands] = useState([]);

    useEffect(() => {
        if (!track || !track.mediaStream) {
            return;
        }

        const ctx = new AudioContext();
        const source = ctx.createMediaStreamSource(track.mediaStream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Float32Array(bufferLength);

        const updateVolume = () => {
            analyser.getFloatFrequencyData(dataArray);
            let frequencies = new Float32Array(dataArray.length);
            for (let i = 0; i < dataArray.length; i++) {
                frequencies[i] = dataArray[i];
            }
            frequencies = frequencies.slice(loPass, hiPass);

            const normalizedFrequencies = normalizeFrequencies(frequencies);
            const chunkSize = Math.ceil(normalizedFrequencies.length / bands);
            const chunks = [];
            for (let i = 0; i < bands; i++) {
                chunks.push(
                    normalizedFrequencies.slice(i * chunkSize, (i + 1) * chunkSize)
                );
            }

            setFrequencyBands(chunks);
        };

        const interval = setInterval(updateVolume, 10);

        return () => {
            source.disconnect();
            clearInterval(interval);
        };
    }, [track, track?.mediaStream, loPass, hiPass, bands]);

    return frequencyBands;
}; 