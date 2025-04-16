
import { useState } from "react";
import { type Order } from "@/types/orders";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { OrderRowStatusBadge } from "./row/OrderRowStatusBadge";
import { OrderRowTagCell } from "./row/OrderRowTagCell";
import OrderPipelineDialog from "./OrderPipelineDialog";
import { Edit, Trash, Tag, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateFormatter } from "./row/DateFormatter";
import { generateOrderPDF } from "@/utils/pdfGenerator";

interface OrderCardViewProps {
  orders: Order[];
  selectedOrders: string[];
  onSelectOrder: (orderId: string) => void;
  onDeleteOrder: (orderId: string) => void;
  onAssignTag: (orderId: string, tagId: string) => void;
}

export function OrderCardView({
  orders,
  selectedOrders,
  onSelectOrder,
  onDeleteOrder,
  onAssignTag,
}: OrderCardViewProps) {
  const [pipelineDialogOrder, setPipelineDialogOrder] = useState<Order | null>(null);
  const [pipelineDialogOpen, setPipelineDialogOpen] = useState(false);
  
  const handlePipelineClick = (order: Order) => {
    setPipelineDialogOrder(order);
    setPipelineDialogOpen(true);
  };

  const handleDownloadPDF = (order: Order) => {
    try {
      generateOrderPDF(order);
    } catch (error) {
      console.error("Error triggering PDF download:", error);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="p-4 pb-2 bg-card flex flex-row items-start justify-between">
            <div className="flex flex-row items-center space-x-2">
              <Checkbox
                checked={selectedOrders.includes(order.id)}
                onCheckedChange={() => onSelectOrder(order.id)}
              />
              <div 
                className="font-medium text-foreground hover:text-primary cursor-pointer transition-colors"
                onClick={() => handlePipelineClick(order)}
              >
                {order.id}
              </div>
            </div>
            <OrderRowStatusBadge status={order.status} />
          </CardHeader>
          
          <CardContent className="p-4 pt-2">
            <div className="space-y-2">
              <div className="font-medium text-base">{order.customer}</div>
              <div className="text-sm text-muted-foreground">
                <span className="block">Created: <DateFormatter dateString={order.createdAt} /></span>
                {order.dueDate && (
                  <span className="block">Due: <DateFormatter dateString={order.dueDate} /></span>
                )}
              </div>
              
              {order.items.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">Items:</p>
                  <ul className="list-disc list-inside text-sm">
                    {order.items.slice(0, 2).map((item, index) => (
                      <li key={index} className="truncate">{item}</li>
                    ))}
                    {order.items.length > 2 && (
                      <li className="text-muted-foreground">+{order.items.length - 2} more</li>
                    )}
                  </ul>
                </div>
              )}
              
              {order.tagId && (
                <div className="mt-1">
                  <p className="text-xs text-muted-foreground">Tag:</p>
                  <OrderRowTagCell tagId={order.tagId} />
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="p-3 pt-0 bg-card/50 justify-end">
            <div className="flex space-x-1">
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0"
                onClick={() => handleDownloadPDF(order)}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0"
                onClick={() => onAssignTag(order.id, '')}
              >
                <Tag className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0"
                onClick={() => window.location.href = `/order/${order.id}`}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onDeleteOrder(order.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
      
      {/* Pipeline Dialog */}
      {pipelineDialogOrder && (
        <OrderPipelineDialog
          order={pipelineDialogOrder}
          open={pipelineDialogOpen}
          onOpenChange={setPipelineDialogOpen}
        />
      )}
    </div>
  );
}
