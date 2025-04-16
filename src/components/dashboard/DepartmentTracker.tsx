
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

type Department = {
  id: number;
  name: string;
  description?: string; 
};

interface DepartmentTrackerProps {
  currentDepartment: number;
  departments: Department[];
  compact?: boolean; // Optional compact prop
}

export default function DepartmentTracker({ 
  currentDepartment, 
  departments, 
  compact = false 
}: DepartmentTrackerProps) {
  return (
    <div className={cn("w-full py-4", compact ? "scale-100" : "")}>
      <div className="relative flex items-center justify-between">
        {departments.map((department, index) => {
          const isCompleted = index < currentDepartment;
          const isCurrent = index === currentDepartment;
          
          return (
            <div 
              key={department.id} 
              className="flex flex-col items-center relative z-10"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out",
                  isCompleted 
                    ? "bg-primary text-primary-foreground" 
                    : isCurrent 
                      ? "bg-primary/20 text-primary border-2 border-primary animate-[scale_2s_ease-in-out_infinite]" 
                      : "bg-secondary text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Circle className={cn("h-5 w-5", isCurrent ? "fill-primary/20" : "")} />
                )}
              </div>
              <div className="mt-2 text-center">
                <p className={cn(
                  "text-xs font-medium",
                  isCompleted ? "text-primary" : isCurrent ? "text-foreground" : "text-muted-foreground"
                )}>
                  {department.name}
                </p>
              </div>
            </div>
          );
        })}
        
        {/* Connecting line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-secondary -z-0">
          <div 
            className="absolute h-full bg-primary transition-all duration-500 ease-in-out" 
            style={{ 
              width: `${(currentDepartment / (departments.length - 1)) * 100}%` 
            }} 
          />
        </div>
      </div>
    </div>
  );
}
