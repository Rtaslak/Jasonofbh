
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";

interface OrderEmptyStateProps {
  colSpan: number;
}

export function OrderEmptyState({ colSpan }: OrderEmptyStateProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center py-6 text-muted-foreground">
        No orders found matching your filters
      </TableCell>
    </TableRow>
  );
}
