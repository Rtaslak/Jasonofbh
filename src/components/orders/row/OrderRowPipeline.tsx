
import { useState, useEffect } from "react";
import { type Order } from "@/types/orders";
import DepartmentTracker from "@/components/dashboard/DepartmentTracker";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";

// Same department structure as used in Dashboard and OrderPipelineDialog
const pipelineDepartments = [
  { id: 1, name: "Designers" },
  { id: 2, name: "Jewelers" },
  { id: 5, name: "Diamond Counting" },
  { id: 3, name: "Setters" },
  { id: 4, name: "Polisher" },
  { id: 6, name: "Shipping" }
];

// Map status to department position in the pipeline
// Updated to correctly map to the current department index, not next department
const statusToDepartmentIndex = {
  "new": 0,
  "in-progress": 1,
  "completed": 5
};

// Map department names to their indices in the pipeline array
const departmentNameToIndex: Record<string, number> = {
  "designers": 0,
  "jewelers": 1,
  "diamondCounting": 2,
  "setters": 3,
  "polisher": 4,
  "shipping": 5
};

interface OrderRowPipelineProps {
  order: Order;
}

export function OrderRowPipeline({ order }: OrderRowPipelineProps) {
  const [currentDepartment, setCurrentDepartment] = useState(0);
  
  // Determine the current department based on order status, lastSeen, and departmentStatus
  useEffect(() => {
    // If the order has departmentStatus and was recently seen
    if (order.departmentStatus && order.lastSeen && (Date.now() - order.lastSeen < 60000)) {
      // Find the active department
      const activeDepartment = Object.entries(order.departmentStatus).find(([_, isActive]) => isActive);
      
      if (activeDepartment) {
        // Set the current department index based on the active department
        const departmentIndex = departmentNameToIndex[activeDepartment[0]];
        setCurrentDepartment(departmentIndex !== undefined ? departmentIndex : 0);
        return;
      }
    }
    
    // Fallback to status-based department if no active department found
    const isActive = order.lastSeen && (Date.now() - order.lastSeen < 60000);
    
    const departmentIndex = isActive && order.status in statusToDepartmentIndex 
      ? statusToDepartmentIndex[order.status] 
      : 0; // Default to "new" if not active
    
    setCurrentDepartment(departmentIndex);
  }, [order.status, order.lastSeen, order.departmentStatus]);

  // Create a function to render the department transitions tooltip content
  const renderTransitionsTooltip = () => {
    if (!order.departmentTransitions || order.departmentTransitions.length === 0) {
      return <p className="text-sm">No transitions recorded</p>;
    }
    
    // Get the last 5 transitions to avoid a very long tooltip
    const recentTransitions = [...order.departmentTransitions]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
    
    return (
      <div className="max-w-[250px]">
        <p className="text-sm font-medium mb-1">Recent Department Transitions</p>
        <ul className="text-xs space-y-1">
          {recentTransitions.map((transition, index) => (
            <li key={index} className="flex justify-between">
              <span className="capitalize">{transition.department.replace(/([A-Z])/g, ' $1').trim()}</span>
              <span className="text-muted-foreground ml-2">
                {format(transition.timestamp, 'MMM d, h:mm a')}
              </span>
            </li>
          ))}
        </ul>
        {order.departmentTransitions.length > 5 && (
          <p className="text-xs text-muted-foreground mt-1">
            + {order.departmentTransitions.length - 5} more transitions
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="w-full min-w-[550px] max-w-full px-8 flex flex-col items-center"> 
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-help w-full">
              <DepartmentTracker 
                currentDepartment={currentDepartment} 
                departments={pipelineDepartments}
                compact={true}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            {renderTransitionsTooltip()}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
