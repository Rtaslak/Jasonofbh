
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { assignReaderToJewelers } from "@/services/rfid/tagService";
import { Tag, Wifi, Map } from "lucide-react";

export function QuickReaderAssignment() {
  const [isAssigning, setIsAssigning] = useState(false);

  const handleAssignReader = async () => {
    setIsAssigning(true);
    
    try {
      // Get the socket instance directly from the window object where it's stored
      const socket = (window as any).socketInstance;
      
      if (!socket) {
        throw new Error("WebSocket connection not available");
      }
      
      // We're specifically targeting the RG reader for now
      const result = await assignReaderToJewelers(socket, "RG");
      
      toast.success(
        "RFID Reader assigned to Jewelers", 
        { 
          description: "Reader RG and all antennas have been mapped to the Jewelers department stations"
        }
      );
    } catch (error) {
      console.error("Error assigning reader:", error);
      toast.error(
        "Assignment failed", 
        { 
          description: "Could not assign reader to Jewelers department" 
        }
      );
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="bg-accent/20 p-4 rounded-lg mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Wifi className="h-5 w-5 text-green-500" />
          <span className="font-medium">RFID Reader RG Online</span>
        </div>
        <Button 
          onClick={handleAssignReader} 
          disabled={isAssigning}
          size="sm"
          className="gap-2"
        >
          <Map className="h-4 w-4" />
          {isAssigning ? "Assigning..." : "Assign to Jewelers"}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        Maps Reader RG to Jewelers department and assigns antennas 1-7 to jeweler stations and antenna 8 to the tag assignment station
      </p>
    </div>
  );
}
