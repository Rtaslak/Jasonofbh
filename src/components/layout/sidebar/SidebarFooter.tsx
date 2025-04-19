// src/components/layout/sidebar/SidebarFooter.tsx
import React from "react";
import { useMqttConnection } from "@/hooks/mqtt/useMqttConnection";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export function SidebarFooter() {
  const { connectionStatus } = useMqttConnection();

  const statusColor = {
    connected: "text-green-500",
    disconnected: "text-red-500",
    connecting: "text-yellow-500",
  }[connectionStatus];

  return (
    <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground bg-muted/30">
      <span className="flex items-center gap-2">
        <Circle className={cn("h-3 w-3", statusColor)} />
        {connectionStatus === "connected" ? "RFID Connected" : "RFID Disconnected"}
      </span>
    </div>
  );
}
