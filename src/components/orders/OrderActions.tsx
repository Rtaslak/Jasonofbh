
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

interface OrderActionsProps {
  selectedOrders: string[] | Set<string>;
  onDeleteSelected: () => void;
}

export function OrderActions({ selectedOrders, onDeleteSelected }: OrderActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const selectedCount = Array.isArray(selectedOrders) ? selectedOrders.length : selectedOrders.size;
  const hasSelectedOrders = selectedCount > 0;
  const navigate = useNavigate();

  const handleDeleteClick = () => {
    if (hasSelectedOrders) {
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    onDeleteSelected();
    setDeleteDialogOpen(false);
  };

  const handleCreateOrder = () => {
    navigate("/orders/new");
  };

  return (
    <>
      <div className="flex space-x-2">
        <Button
          variant="default"
          size="sm"
          onClick={handleCreateOrder}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          New Order
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleDeleteClick}
          disabled={!hasSelectedOrders}
          className={`${hasSelectedOrders ? "text-destructive hover:bg-destructive/10 hover:text-destructive" : ""}`}
        >
          <Trash className="h-4 w-4 mr-1" />
          Delete
          {hasSelectedOrders && <span className="ml-1">({selectedCount})</span>}
        </Button>
      </div>

      {/* Bulk delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedCount} selected order{selectedCount > 1 ? "s" : ""}. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
