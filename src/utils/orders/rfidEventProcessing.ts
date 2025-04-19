import { toast } from "sonner";
import { Order } from "@/types/orders";
import { TAG_RATE_LIMIT, EMIT_RATE_LIMIT } from "./rfidConstants";

// Temp map until you move to live department lookup
const readerToDepartmentMap: Record<string, number> = {
  "reader1": 1,
  "reader2": 2,
  "reader3": 3,
  "reader4": 4,
  "reader5": 5,
  "reader6": 6
};

function getDepartmentIdFromReader(readerId: string): number | null {
  return readerToDepartmentMap[readerId.toLowerCase()] || null;
}

export const processRfidEvent = (
  tagId: string,
  readerId: string
): any => {
  const normalizedTagId = tagId.toLowerCase();
  const normalizedReaderId = readerId.toLowerCase();
  const locationKey = `${normalizedReaderId}`;
  const now = Date.now();

  const lastSeen = lastSeenTagTimestamps.get(`${normalizedTagId}-${locationKey}`);
  if (lastSeen && (now - lastSeen < TAG_RATE_LIMIT)) {
    return { success: true, unchanged: true };
  }

  const order = orders.find(
    (o) => o.tagId?.toLowerCase() === normalizedTagId
  );

  if (!order) return { success: false, message: "No matching order" };

  const departmentId = getDepartmentIdFromReader(normalizedReaderId);
  if (!departmentId) return { success: false, message: "No department for reader" };

  const prevDept = (order as any).departmentId || 0;
  order.lastSeen = now;
  (order as any).departmentId = departmentId;

  lastSeenTagTimestamps.set(`${normalizedTagId}-${locationKey}`, now);

  if (prevDept !== departmentId) {
    order.departmentTransitions = order.departmentTransitions || [];
    order.departmentTransitions.push({ department: getDepartmentName(departmentId), timestamp: now });

    const lastEmitted = lastEmittedUpdates.get(order.id) || 0;
    if (now - lastEmitted >= EMIT_RATE_LIMIT) {
      toast.success(`Order ${order.id} moved to ${getDepartmentName(departmentId)}`);
      lastEmittedUpdates.set(order.id, now);
    }

    return {
      success: true,
      previousDepartment: prevDept,
      newDepartment: departmentId,
    };
  }

  return { success: true, unchanged: true };
};

const lastSeenTagTimestamps = new Map<string, number>();
const lastEmittedUpdates = new Map<string, number>();

function getDepartmentName(departmentId: number): string {
  switch (departmentId) {
    case 1: return "Designers";
    case 2: return "Jewelers";
    case 3: return "Setters";
    case 4: return "Polisher";
    case 5: return "Diamond Counting";
    case 6: return "Shipping";
    default: return "Unknown";
  }
}
