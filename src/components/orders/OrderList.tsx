
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { OrderRow } from "./OrderRow";
import { type Order } from "@/types/orders";
import { OrderColumnVisibility } from "./OrderColumnVisibility";
import { OrderTableHeader } from "./OrderTableHeader";
import { OrderEmptyState } from "./OrderEmptyState";
import { useColumnVisibility } from "./hooks/useColumnVisibility";
import { useSorting } from "./hooks/useSorting";

interface OrderListProps {
  orders: Order[];
  selectedOrders: string[] | Set<string>;
  onSelectOrder: (orderId: string) => void;
  onSelectAll: (checked: boolean) => void;
  onSaveEdit: (orderId: string) => void;
  onDeleteOrder: (orderId: string) => void;
  onToggleEditMode: (orderId: string) => void;
  onDeleteSelected: () => void;
  onAssignTag: (orderId: string, tagId: string) => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  statusFilter?: string;
  onStatusFilterChange?: (value: string) => void;
}

export function OrderList({
  orders,
  selectedOrders = [],
  onSelectOrder,
  onSelectAll,
  onSaveEdit,
  onDeleteOrder,
  onToggleEditMode,
  onDeleteSelected,
  onAssignTag,
}: OrderListProps) {
  const { columnVisibility, toggleColumn, getVisibleColumnsCount } = useColumnVisibility();
  
  // Add sorting functionality
  const { sortConfig, onSort, sortOrders } = useSorting('createdAt');
  
  // Sort orders before rendering
  const sortedOrders = sortOrders(orders);
  
  // Convert selectedOrders to array if it's a Set
  const selectedOrdersArray = Array.isArray(selectedOrders) 
    ? selectedOrders 
    : Array.from(selectedOrders);
  
  const allSelected = selectedOrdersArray.length === orders.length && orders.length > 0;
  const visibleColumnsCount = getVisibleColumnsCount();

  return (
    <div className="space-y-4">
      <OrderColumnVisibility 
        columnVisibility={columnVisibility} 
        toggleColumn={toggleColumn}
      />

      <div className="rounded-md border shadow-sm overflow-hidden bg-card">
        <Table>
          <OrderTableHeader 
            columnVisibility={columnVisibility}
            onSelectAll={onSelectAll}
            hasOrders={orders.length > 0}
            allSelected={allSelected}
            sortConfig={sortConfig}
            onSort={onSort}
          />
          <TableBody>
            {sortedOrders.length === 0 ? (
              <OrderEmptyState colSpan={visibleColumnsCount} />
            ) : (
              sortedOrders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  isSelected={selectedOrdersArray.includes(order.id)}
                  onSelect={onSelectOrder}
                  onSave={onSaveEdit}
                  onDelete={onDeleteOrder}
                  onEdit={onToggleEditMode}
                  onAssignTag={onAssignTag}
                  columnVisibility={columnVisibility}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Re-export the ColumnVisibility type for use in other components
export { type ColumnVisibility } from "./types/orderTypes";
