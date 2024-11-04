import { io } from 'socket.io-client';
import { WEBSOCKET_URL as WS_URL } from './config';

const socket = io(WS_URL, {
    transports: ['websocket'], // Use WebSocket for direct connection
    reconnection: true,        // Automatically try to reconnect if disconnected
    reconnectionAttempts: 10,  // Number of attempts to reconnect
    reconnectionDelay: 1000,   // Wait 1 second before each reconnection attempt
});

// Add event listeners
socket.on('connect', () => {
    console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server');
});

// Export the socket instance for use in other components
export default socket;
