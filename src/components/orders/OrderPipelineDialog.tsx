import { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowUpDown } from "lucide-react";
import DepartmentTracker from "@/components/dashboard/DepartmentTracker";
import { type Order } from "@/types/orders";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

const pipelineDepartments = [
  { id: 1, name: "Designers" },
  { id: 2, name: "Jewelers" },
  { id: 5, name: "Diamond Counting" },
  { id: 3, name: "Setters" },
  { id: 4, name: "Polisher" },
  { id: 6, name: "Shipping" }
];

const departmentNameToIndex: Record<string, number> = {
  "designers": 0,
  "jewelers": 1,
  "diamondCounting": 2,
  "setters": 3,
  "polisher": 4,
  "shipping": 5
};

const statusToDepartmentIndex = {
  "new": 0,
  "in-progress": 1,
  "completed": 5
};

interface OrderPipelineDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function OrderPipelineDialog({
  order,
  open,
  onOpenChange,
}: OrderPipelineDialogProps) {
  const [currentDepartment, setCurrentDepartment] = useState(0);
  const [showAllTransitions, setShowAllTransitions] = useState(false);
  
  useEffect(() => {
    if (!order) return;
    
    if (order.departmentStatus && order.lastSeen && (Date.now() - order.lastSeen < 60000)) {
      const activeDepartment = Object.entries(order.departmentStatus).find(([_, isActive]) => isActive);
      
      if (activeDepartment) {
        const departmentIndex = departmentNameToIndex[activeDepartment[0]];
        setCurrentDepartment(departmentIndex !== undefined ? departmentIndex : 0);
        return;
      }
    }
    
    const isActive = order.lastSeen && (Date.now() - order.lastSeen < 60000);
    
    const departmentIndex = isActive && order.status in statusToDepartmentIndex 
      ? statusToDepartmentIndex[order.status] 
      : 0;
    
    setCurrentDepartment(departmentIndex);
  }, [order]);

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Pipeline: {order.id}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Customer</p>
              <p className="text-base">{order.customer}</p>
            </div>
            <Badge className="capitalize">
              {(order.status ?? 'unknown').replace('-', ' ')}
            </Badge>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Production Pipeline Position</p>
            <div className="border rounded-lg p-4 bg-card">
              <DepartmentTracker 
                currentDepartment={currentDepartment} 
                departments={pipelineDepartments} 
              />
            </div>
          </div>
          
          {order.departmentTransitions && order.departmentTransitions.length > 0 && (
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium mb-2">Department History</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowAllTransitions(!showAllTransitions)}
                  className="h-8 px-2 text-xs"
                >
                  {showAllTransitions ? "Show Recent" : "Show All"}
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </div>
              
              <div className="border rounded-lg bg-card overflow-hidden">
                <ScrollArea className={showAllTransitions ? "h-[200px]" : "max-h-[150px]"}>
                  <div className="p-3">
                    <ul className="space-y-2">
                      {(showAllTransitions 
                        ? [...order.departmentTransitions].sort((a, b) => b.timestamp - a.timestamp)
                        : [...order.departmentTransitions].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5)
                      ).map((transition, index) => (
                        <li key={index} className="flex justify-between text-sm border-b pb-1 last:border-0">
                          <span className="capitalize font-medium">
                            {(transition.department ?? 'unknown').replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="text-muted-foreground">
                            {format(transition.timestamp, 'MMM d, h:mm:ss a')}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
          
          <div className="pt-2">
            <p className="text-sm font-medium mb-2">Items</p>
            {Array.isArray(order.items) && order.items.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {order.items.map((item, index) => (
                  <li key={index} className="text-sm">{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No items listed for this order.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
