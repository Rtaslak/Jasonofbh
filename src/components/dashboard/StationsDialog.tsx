
import { User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import StationCard from "./StationCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { departmentStations, getStationOrders } from "@/utils/orders/departmentManagement";

interface StationsDialogProps {
  department: {
    id: number;
    name: string;
    description: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function StationsDialog({ department, open, onOpenChange }: StationsDialogProps) {
  const stations = department ? departmentStations[department.id] || [] : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{department?.name} Stations</DialogTitle>
        </DialogHeader>
        
        {stations.length > 0 ? (
          <div className="grid gap-6 py-4">
            {stations.map((station, index) => {
              const stationOrders = getStationOrders(station.orderIds);
              return (
                <div key={index} className="space-y-4">
                  <StationCard
                    name={station.name}
                    description={station.description}
                    icon={<User className="h-4 w-4" />}
                    count={stationOrders.length}
                    departmentId={department?.id}
                  />
                  
                  {stationOrders.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Updated</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stationOrders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">{order.id}</TableCell>
                              <TableCell>{order.customer}</TableCell>
                              <TableCell>{order.items.join(", ")}</TableCell>
                              <TableCell>{order.updatedAt}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No orders currently in this station</p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex justify-center items-center py-12">
            <p className="text-muted-foreground text-lg">No stations available in this department</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
