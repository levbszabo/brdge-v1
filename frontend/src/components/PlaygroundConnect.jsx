import { useState } from "react";
import { Button } from "./button/Button";

export const PlaygroundConnect = ({ onConnectClicked }) => {
    const [url, setUrl] = useState("");
    const [token, setToken] = useState("");

    return (
        <div className="flex flex-col gap-4 w-full max-w-lg">
            <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-500">WebSocket URL</label>
                <textarea
                    className="w-full text-xs bg-transparent text-gray-300 p-2 rounded-sm border border-gray-800 focus:outline-none focus:border-gray-700 focus:ring-1 focus:ring-gray-700"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    rows={2}
                ></textarea>
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-500">Token</label>
                <textarea
                    className="w-full text-xs bg-transparent text-gray-300 p-2 rounded-sm border border-gray-800 focus:outline-none focus:border-gray-700 focus:ring-1 focus:ring-gray-700"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    rows={4}
                ></textarea>
            </div>
            <Button
                className="w-full"
                disabled={!url || !token}
                onClick={() => {
                    onConnectClicked({ url, token });
                }}
            >
                Connect
            </Button>
        </div>
    );
}; 