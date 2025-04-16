
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface StationOrdersTableProps {
  stationOrders: any[];
}

export default function StationOrdersTable({ stationOrders }: StationOrdersTableProps) {
  if (stationOrders.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">No orders currently in this department</p>
    );
  }

  return (
    <div className="border rounded-md overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tag ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stationOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.items.join(", ")}</TableCell>
              <TableCell>{order.updatedAt}</TableCell>
              <TableCell>
                <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                  order.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                  order.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                }`}>
                  {order.status === 'in-progress' ? 'In Progress' : 
                   order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </TableCell>
              <TableCell>
                {order.tagId ? (
                  <code className="px-1 py-0.5 bg-secondary/50 rounded text-xs">{order.tagId}</code>
                ) : (
                  <span className="text-muted-foreground text-xs">No tag</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
