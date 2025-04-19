import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import { type Order } from "@/types/orders";
import { ColumnVisibility } from "./types/orderTypes";
import { OrderRowActions } from "./row/OrderRowActions";
import { OrderRowStatusBadge } from "./row/OrderRowStatusBadge";
import { OrderRowIdCell } from "./row/OrderRowIdCell";
import { DateFormatter } from "./row/DateFormatter";
import { OrderRowTagCell } from "./row/OrderRowTagCell";
import { OrderRowItemsCell } from "./row/OrderRowItemsCell";
import { OrderRowPipeline } from "./row/OrderRowPipeline";

interface OrderRowProps {
  order: Order;
  isSelected: boolean;
  onSelect: (orderId: string) => void;
  onSave: (orderId: string) => void;
  onDelete: (orderId: string) => void;
  onEdit: (orderId: string) => void;
  onAssignTag: (orderId: string, tagId: string) => void;
  columnVisibility: ColumnVisibility;
}

export function OrderRow({
  order,
  isSelected,
  onSelect,
  onSave,
  onDelete,
  onEdit,
  onAssignTag,
  columnVisibility,
}: OrderRowProps) {
  return (
    <TableRow 
      key={order.id} 
      className="hover:bg-muted/30 transition-colors"
    >
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(order.id)}
        />
      </TableCell>
      
      {columnVisibility.orderId && (
        <TableCell>
          <span 
            className="font-medium text-foreground hover:text-primary cursor-pointer transition-colors" 
            onClick={() => onEdit(order.id)}
          >
            {order.orderNumber ?? order.id}
          </span>
        </TableCell>
      )}
      
      {columnVisibility.customer && (
        <TableCell>
          {order.isEditing ? (
            <input
              type="text"
              defaultValue={order.customer}
              className="w-full border rounded p-1"
            />
          ) : (
            <div className="font-medium">{order.customer}</div>
          )}
        </TableCell>
      )}
      
      {columnVisibility.status && (
        <TableCell>
          <OrderRowStatusBadge status={order.status} />
        </TableCell>
      )}
      
      {columnVisibility.dueDate && (
        <TableCell>
          {order.dueDate && (
            <span className="text-sm">
              <DateFormatter dateString={order.dueDate} />
            </span>
          )}
        </TableCell>
      )}
      
      {columnVisibility.salesperson && (
        <TableCell>{order.salesperson || "—"}</TableCell>
      )}
      
      {columnVisibility.items && (
        <TableCell>
          <OrderRowItemsCell items={order.items} />
        </TableCell>
      )}
      
      {/* Pipeline column - always visible */}
      <TableCell className="w-64">
        <OrderRowPipeline order={order} />
      </TableCell>
      
      {columnVisibility.tagId && (
        <TableCell>
          <OrderRowTagCell tagId={order.tagId} />
        </TableCell>
      )}
      
      {columnVisibility.actions && (
        <TableCell className="text-right">
          <OrderRowActions 
            order={order}
            onDelete={onDelete}
            onAssignTag={onAssignTag}
          />
        </TableCell>
      )}
    </TableRow>
  );
}
