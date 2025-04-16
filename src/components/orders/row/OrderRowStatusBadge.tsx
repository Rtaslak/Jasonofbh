
import { Badge } from "@/components/ui/badge";

interface OrderRowStatusBadgeProps {
  status: string;
}

export function OrderRowStatusBadge({ status }: OrderRowStatusBadgeProps) {
  // Status badge color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "in-progress":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getFormattedStatus = (status: string) => {
    return status === "in-progress" 
      ? "In Progress" 
      : status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Badge className={`${getStatusColor(status)} border-0`} variant="outline">
      {getFormattedStatus(status)}
    </Badge>
  );
}
