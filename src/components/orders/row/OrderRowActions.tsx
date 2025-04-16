
import { useState } from "react";
import { Edit, Trash, Tag, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { TagAssignmentDialog } from "../TagAssignmentDialog";
import OrderPipelineDialog from "../OrderPipelineDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { generateOrderPDF } from "@/utils/pdfGenerator";
import { type Order } from "@/types/orders";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface OrderRowActionsProps {
  order: Order;
  onDelete: (orderId: string) => void;
  onAssignTag: (orderId: string, tagId: string) => void;
}

export function OrderRowActions({ order, onDelete, onAssignTag }: OrderRowActionsProps) {
  const navigate = useNavigate();
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [pipelineDialogOpen, setPipelineDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/order/${order.id}`);
  };

  const handleDownloadPDF = () => {
    console.log("Download PDF clicked for order:", order.id);
    try {
      generateOrderPDF(order);
    } catch (error) {
      console.error("Error triggering PDF download:", error);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(order.id);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <div className="flex justify-end space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDownloadPDF}
                className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download Order PDF</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setTagDialogOpen(true)}
                className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
              >
                <Tag className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Assign RFID Tag</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleEditClick}
                className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Order</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDeleteClick}
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete Order</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete order {order.id}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <TagAssignmentDialog
        orderId={order.id}
        open={tagDialogOpen}
        onOpenChange={setTagDialogOpen}
        onAssign={onAssignTag}
      />
      
      <OrderPipelineDialog
        order={order}
        open={pipelineDialogOpen}
        onOpenChange={setPipelineDialogOpen}
      />
    </>
  );
}
