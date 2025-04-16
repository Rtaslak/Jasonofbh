
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { ColumnVisibility } from "./types/orderTypes";

interface OrderColumnVisibilityProps {
  columnVisibility: ColumnVisibility;
  toggleColumn: (column: keyof ColumnVisibility) => void;
}

export function OrderColumnVisibility({
  columnVisibility,
  toggleColumn
}: OrderColumnVisibilityProps) {
  return (
    <div className="flex justify-end mb-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="ml-auto">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Columns
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-background border shadow-md">
          <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={columnVisibility.orderId}
            onCheckedChange={() => toggleColumn('orderId')}
          >
            Order ID
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={columnVisibility.customer}
            onCheckedChange={() => toggleColumn('customer')}
          >
            Customer
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={columnVisibility.status}
            onCheckedChange={() => toggleColumn('status')}
          >
            Status
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={columnVisibility.date}
            onCheckedChange={() => toggleColumn('date')}
          >
            Date
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={columnVisibility.dueDate}
            onCheckedChange={() => toggleColumn('dueDate')}
          >
            Due Date
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={columnVisibility.salesperson}
            onCheckedChange={() => toggleColumn('salesperson')}
          >
            Salesperson
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={columnVisibility.items}
            onCheckedChange={() => toggleColumn('items')}
          >
            Items
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={columnVisibility.tagId}
            onCheckedChange={() => toggleColumn('tagId')}
          >
            Tag ID
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
