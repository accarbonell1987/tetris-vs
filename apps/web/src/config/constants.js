// Configuration constants for the Tetris VS application

export const SESSION_EXPIRY_HOURS = 24; // hours
export const SESSION_EXPIRY_MS = SESSION_EXPIRY_HOURS * 60 * 60 * 1000;

export const AVATAR_RETRY_LIMIT = 10;

// WebSocket server URL is configured via environment variable VITE_API_SERVER