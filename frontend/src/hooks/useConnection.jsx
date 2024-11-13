"use client"

import { useCloud } from "../cloud/useCloud";
import { createContext, useState, useContext, useCallback } from "react";
import { useConfig } from "./useConfig";
import { useToast } from "../components/toast/ToasterProvider";

const ConnectionContext = createContext();

export const ConnectionProvider = ({ children }) => {
    const { generateToken, wsUrl: cloudWSUrl } = useCloud();
    const { setToastMessage } = useToast();
    const { config } = useConfig();
    const [connectionDetails, setConnectionDetails] = useState({
        wsUrl: "",
        token: "",
        shouldConnect: false,
        mode: "manual"
    });

    const connect = useCallback(async (mode) => {
        let token = "";
        let url = "";

        console.log("Attempting to connect with mode:", mode);

        try {
            if (mode === "cloud") {
                console.log("Cloud mode - generating token...");
                token = await generateToken();
                url = cloudWSUrl;
                console.log("Cloud token generated, URL:", url);
            } else if (mode === "env") {
                console.log("Env mode - checking LIVEKIT_URL...");
                url = process.env.REACT_APP_LIVEKIT_URL;

                if (!url) {
                    console.error("REACT_APP_LIVEKIT_URL is not set");
                    throw new Error("LIVEKIT_URL is not configured");
                }
                console.log("Using LIVEKIT_URL:", url);

                // Fetch token from backend
                console.log("Fetching token from backend...");
                const response = await fetch("/api/getToken");
                console.log("Token response status:", response.status);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Token fetch failed:", errorText);
                    throw new Error(`Failed to fetch token: ${errorText}`);
                }

                token = await response.text();
                console.log("Token received from backend");
            } else {
                console.log("Manual mode - using config settings");
                token = config.settings.token;
                url = config.settings.ws_url;
                console.log("Using manual URL:", url);
            }

            if (!url || !token) {
                console.error("Missing URL or token:", { url, hasToken: !!token });
                throw new Error("Missing connection details");
            }

            console.log("Setting connection details...");
            setConnectionDetails({ wsUrl: url, token, shouldConnect: true, mode });
            console.log("Connection details set successfully");

        } catch (error) {
            console.error("Connection error:", error);
            setToastMessage({
                type: "error",
                message: `Connection failed: ${error.message}`,
            });
            // Reset connection details on error
            setConnectionDetails({
                wsUrl: "",
                token: "",
                shouldConnect: false,
                mode: "manual"
            });
        }
    }, [cloudWSUrl, config.settings.token, config.settings.ws_url, generateToken, setToastMessage]);

    const disconnect = useCallback(async () => {
        console.log("Disconnecting...");
        setConnectionDetails((prev) => ({ ...prev, shouldConnect: false }));
    }, []);

    return (
        <ConnectionContext.Provider
            value={{
                wsUrl: connectionDetails.wsUrl,
                token: connectionDetails.token,
                shouldConnect: connectionDetails.shouldConnect,
                mode: connectionDetails.mode,
                connect,
                disconnect,
            }}
        >
            {children}
        </ConnectionContext.Provider>
    );
};

export const useConnection = () => {
    const context = useContext(ConnectionContext);
    if (context === undefined) {
        throw new Error("useConnection must be used within a ConnectionProvider");
    }
    return context;
}; 