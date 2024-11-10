import React from 'react';
import {
    LiveKitRoom,
    RoomAudioRenderer,
    StartAudio,
} from "@livekit/components-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState, useMemo } from "react";

import { PlaygroundConnect } from "../components/PlaygroundConnect";
import Playground from "../components/playground/Playground";
import { PlaygroundToast } from "../components/toast/PlaygroundToast";
import { ConfigProvider, useConfig } from "../hooks/useConfig";
import { ConnectionProvider, useConnection } from "../hooks/useConnection";
import { ToasterProvider as ToastProvider, useToast } from '../components/toast/ToasterProvider';

const themeColors = [
    "cyan", "green", "amber", "blue", "violet", "rose", "pink", "teal",
];

function PlaygroundInner() {
    const { shouldConnect, wsUrl, token, mode, connect, disconnect } = useConnection();
    const { config } = useConfig();
    const { toastMessage, setToastMessage } = useToast();

    // Remove TypeScript type annotations
    const handleConnect = useCallback((connected, connectionMode) => {
        connected ? connect(connectionMode) : disconnect();
    }, [connect, disconnect]);

    const showPG = useMemo(() => {
        if (process.env.REACT_APP_LIVEKIT_URL) {
            return true;
        }
        if (wsUrl) {
            return true;
        }
        return false;
    }, [wsUrl]);

    return (
        <div className="relative flex flex-col justify-center px-4 items-center h-full w-full bg-black repeating-square-background">
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        className="left-0 right-0 top-0 absolute z-10"
                        initial={{ opacity: 0, translateY: -50 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        exit={{ opacity: 0, translateY: -50 }}
                    >
                        <PlaygroundToast />
                    </motion.div>
                )}
            </AnimatePresence>
            {showPG ? (
                <LiveKitRoom
                    className="flex flex-col h-full w-full"
                    serverUrl={wsUrl}
                    token={token}
                    connect={shouldConnect}
                    onError={(e) => {
                        setToastMessage({ message: e.message, type: "error" });
                        console.error(e);
                    }}
                >
                    <Playground
                        themeColors={themeColors}
                        onConnect={(c) => {
                            const m = process.env.REACT_APP_LIVEKIT_URL ? "env" : mode;
                            handleConnect(c, m);
                        }}
                    />
                    <RoomAudioRenderer />
                    <StartAudio label="Click to enable audio playback" />
                </LiveKitRoom>
            ) : (
                <PlaygroundConnect
                    accentColor={themeColors[0]}
                    onConnectClicked={(mode) => {
                        handleConnect(true, mode);
                    }}
                />
            )}
        </div>
    );
}

function PlaygroundMain() {
    return (
        <ToastProvider>
            <ConfigProvider>
                <ConnectionProvider>
                    <PlaygroundInner />
                </ConnectionProvider>
            </ConfigProvider>
        </ToastProvider>
    );
}

export default PlaygroundMain; 