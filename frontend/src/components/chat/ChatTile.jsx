import { ChatMessage } from "./ChatMessage";
import { ChatMessageInput } from "./ChatMessageInput";
import { ChatMessage as ComponentsChatMessage } from "@livekit/components-react";
import { useEffect, useRef } from "react";

const inputHeight = 48;

// Create a helper function to create chat messages
const createChatMessage = (name, message, isSelf, timestamp) => ({
    name,
    message,
    isSelf,
    timestamp,
});

export const ChatTile = ({ messages, accentColor, onSend }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [containerRef, messages]);

    return (
        <div className="flex flex-col gap-4 w-full h-full">
            <div
                ref={containerRef}
                className="overflow-y-auto"
                style={{
                    height: `calc(100% - ${inputHeight}px)`,
                }}
            >
                <div className="flex flex-col min-h-full justify-end">
                    {messages.map((message, index, allMsg) => {
                        const hideName =
                            index >= 1 && allMsg[index - 1].name === message.name;

                        return (
                            <ChatMessage
                                key={index}
                                hideName={hideName}
                                name={message.name}
                                message={message.message}
                                isSelf={message.isSelf}
                                accentColor={accentColor}
                            />
                        );
                    })}
                </div>
            </div>
            <ChatMessageInput
                height={inputHeight}
                placeholder="Type a message"
                accentColor={accentColor}
                onSend={onSend}
            />
        </div>
    );
};

// Export the createChatMessage helper for use in other components
export { createChatMessage };
