"use client";

import React from "react";
import { useConfig } from "../../hooks/useConfig";
import { useConnection } from "../../hooks/useConnection";
import { useVoiceAssistant } from "@livekit/components-react";
import { NoAgentNotification } from "../NoAgentNotification";
import Chat from "../Chat";

function Playground({ onConnect }) {
    const { config } = useConfig();
    const { state } = useVoiceAssistant();
    const { shouldConnect } = useConnection();

    return (
        <div className="flex flex-col h-full w-full">
            <NoAgentNotification state={state} />
            <div className="flex flex-1 gap-4 p-4">
                <div className="flex-1">
                    {/* Main content area */}
                </div>
                {config.settings.chat && (
                    <div className="w-80">
                        <Chat />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Playground;
