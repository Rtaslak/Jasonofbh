
import { Checkbox } from "@/components/ui/checkbox";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { ColumnVisibility } from "./types/orderTypes";
import { SortConfig, SortField } from "./types/sortingTypes";

interface OrderTableHeaderProps {
  columnVisibility: ColumnVisibility;
  onSelectAll: (checked: boolean) => void;
  hasOrders: boolean;
  allSelected: boolean;
  sortConfig: SortConfig;
  onSort: (field: SortField) => void;
}

export function OrderTableHeader({
  columnVisibility,
  onSelectAll,
  hasOrders,
  allSelected,
  sortConfig,
  onSort,
}: OrderTableHeaderProps) {
  const renderSortButton = (field: SortField, label: string) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=active]:text-primary"
      onClick={() => onSort(field)}
      data-state={sortConfig.field === field ? "active" : "default"}
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[50px]">
          <Checkbox
            checked={allSelected}
            onCheckedChange={(checked) => onSelectAll(!!checked)}
            disabled={!hasOrders}
          />
        </TableHead>
        
        {columnVisibility.orderId && (
          <TableHead>
            {renderSortButton('orderId', 'Order ID')}
          </TableHead>
        )}
        
        {columnVisibility.customer && (
          <TableHead>
            {renderSortButton('customer', 'Customer')}
          </TableHead>
        )}
        
        {columnVisibility.status && (
          <TableHead>
            {renderSortButton('status', 'Status')}
          </TableHead>
        )}
        
        {columnVisibility.dueDate && (
          <TableHead>
            {renderSortButton('dueDate', 'Due Date')}
          </TableHead>
        )}
        
        {columnVisibility.salesperson && (
          <TableHead>Salesperson</TableHead>
        )}
        
        {columnVisibility.items && (
          <TableHead>Items</TableHead>
        )}
        
        <TableHead className="text-center">Production Pipeline</TableHead>
        
        {columnVisibility.tagId && (
          <TableHead>Tag ID</TableHead>
        )}
        
        {columnVisibility.actions && (
          <TableHead className="text-right">Actions</TableHead>
        )}
      </TableRow>
    </TableHeader>
  );
}
