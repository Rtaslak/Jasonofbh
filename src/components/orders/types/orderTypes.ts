
export type SortField = 'orderId' | 'customer' | 'status' | 'dueDate' | 'createdAt';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}
