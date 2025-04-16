
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface MobileSidebarControlsProps {
  onClose: () => void;
}

export default function MobileSidebarControls({ onClose }: MobileSidebarControlsProps) {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={onClose}
      className="absolute right-2 top-2"
    >
      <X className="h-4 w-4" />
    </Button>
  );
}
