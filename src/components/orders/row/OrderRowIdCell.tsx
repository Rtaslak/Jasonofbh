
import { useState } from "react";
import OrderPipelineDialog from "../OrderPipelineDialog";
import { type Order } from "@/types/orders";

interface OrderRowIdCellProps {
  order: Order;
  onOrderIdClick?: (e: React.MouseEvent) => void;
}

export function OrderRowIdCell({ order, onOrderIdClick }: OrderRowIdCellProps) {
  const [pipelineDialogOpen, setPipelineDialogOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setPipelineDialogOpen(true);
    if (onOrderIdClick) {
      onOrderIdClick(e);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span 
        className="font-medium text-foreground hover:text-primary cursor-pointer transition-colors" 
        onClick={handleClick}
      >
        {order.id}
      </span>
      
      <OrderPipelineDialog
        order={order}
        open={pipelineDialogOpen}
        onOpenChange={setPipelineDialogOpen}
      />
    </div>
  );
}
