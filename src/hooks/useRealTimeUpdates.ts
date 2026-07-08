import { useEffect } from "react";
import { io } from "socket.io-client";

export function useRealTimeUpdates() {
  useEffect(() => {
    // Connect to the same origin Socket.IO server
    const socket = io();

    // When the backend emits a dashboard update, trigger a native browser event
    socket.on("dashboard_update", (data) => {
      console.log("Real-time dashboard update received:", data);
      window.dispatchEvent(new Event("dashboard_refresh"));
    });

    return () => {
      socket.disconnect();
    };
  }, []);
}
