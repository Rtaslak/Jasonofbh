// src/lib/socket.ts
import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_RFID_SERVER_URL || "http://localhost:8000", {
  transports: ["websocket"],
  withCredentials: true,
});
