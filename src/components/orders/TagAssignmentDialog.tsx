
import { useState, useEffect, KeyboardEvent } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag, Scan, Loader2 } from "lucide-react";
import { useMqttConnection } from "@/context/mqtt/useMqttConnection";

import { toast } from "sonner";

interface TagAssignmentDialogProps {
  orderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (orderId: string, tagId: string) => void;
}

export function TagAssignmentDialog({
  orderId,
  open,
  onOpenChange,
  onAssign,
}: TagAssignmentDialogProps) {
  const [tagId, setTagId] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const { latestEvent } = useMqttConnection();


  useEffect(() => {
    if (!open) return;

    console.log("[DEBUG] TagAssignmentDialog open for order:", orderId);
    console.log("[DEBUG] Waiting for RFID tag scan events...");
  }, [open, orderId]);

  useEffect(() => {
    if (latestEvent && open) {
      console.log("[DEBUG] Tag assignment dialog received event:", latestEvent);
      
      // Show extra info in console about the tag detection
      console.log(`[DEBUG] Tag detected: ${latestEvent.tagId}`);
      console.log(`[DEBUG] Reader: ${latestEvent.readerId}`);
      console.log(`[DEBUG] Antenna: ${latestEvent.antennaNumber}`);
      console.log(`[DEBUG] Department: ${latestEvent.departmentId}`);
      
      // Always store tag IDs in lowercase for consistent comparison
      setTagId(latestEvent.tagId.toLowerCase());
      
      toast.info("Tag detected", {
        description: `Tag ${latestEvent.tagId} was scanned via reader ${latestEvent.readerId}. Click Assign to confirm.`
      });
    }
  }, [latestEvent, open]);

  // Validate the tag ID
  const isValidTagId = (id: string): boolean => {
    // Basic validation - tag should be at least 4 characters long
    // Add more validation rules as needed for your specific tag format
    return id.trim().length >= 4;
  };

  const handleAssign = async () => {
    const normalizedTagId = tagId.trim().toLowerCase();
    
    if (!normalizedTagId) {
      console.log("[DEBUG] Cannot assign: no tag ID provided");
      toast.error("No tag scanned", {
        description: "Please scan a tag or enter a tag ID manually before assigning"
      });
      return;
    }
    
    if (!isValidTagId(normalizedTagId)) {
      console.log("[DEBUG] Invalid tag ID format:", normalizedTagId);
      toast.error("Invalid tag ID", {
        description: "The tag ID format is invalid. Please scan again or enter a valid tag ID."
      });
      return;
    }
    
    console.log(`[DEBUG] Starting tag assignment: ${normalizedTagId} -> order ${orderId}`);
    setIsAssigning(true);
    
    try {
      console.log(`[DEBUG] Assigning tag ${normalizedTagId} to order ${orderId} from dialog`);
      onAssign(orderId, normalizedTagId);
      onOpenChange(false);
      setTagId("");
      toast.success("Tag assigned", {
        description: `Successfully assigned tag ${normalizedTagId} to order ${orderId}`
      });
      console.log(`[DEBUG] Tag assignment successful: ${normalizedTagId} -> order ${orderId}`);
    } catch (error) {
      console.error("[ERROR] Error assigning tag:", error);
      toast.error("Assignment failed", {
        description: "Could not assign tag to order. Please try again."
      });
    } finally {
      setIsAssigning(false);
    }
  };

  // Handle keyboard events
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Submit on Enter
    if (e.key === 'Enter' && tagId.trim()) {
      e.preventDefault();
      handleAssign();
    }
    
    // Close on Escape
    if (e.key === 'Escape') {
      e.preventDefault();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Assign Tag to Order {orderId}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Scan className="h-4 w-4 text-muted-foreground" />
                <span>Scan Tag or Enter Tag ID</span>
              </div>
              <Input
                value={tagId}
                onChange={(e) => {
                  console.log(`[DEBUG] Tag ID manually entered: ${e.target.value}`);
                  setTagId(e.target.value.toLowerCase()); // Always store in lowercase
                }}
                onKeyDown={handleKeyDown}
                placeholder="Waiting for tag scan or manual entry..."
                className="font-mono"
                autoFocus
                aria-label="Tag ID"
              />
              <p className="text-xs text-muted-foreground">
                Scan any tag or enter a tag ID manually. 
                {import.meta.env.DEV && " In development mode, press 't' to simulate a tag scan."}
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAssign} 
            disabled={isAssigning || !tagId.trim()}
            className="flex items-center gap-2"
          >
            {isAssigning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Assigning...</span>
              </>
            ) : (
              <span>Assign</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
