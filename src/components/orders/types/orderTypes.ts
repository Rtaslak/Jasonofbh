
export type SortField = 'orderId' | 'customer' | 'status' | 'dueDate' | 'createdAt';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}
export type ColumnVisibility = {
  orderId?: boolean;
  customer?: boolean;
  status?: boolean;
  dueDate?: boolean;
  createdAt?: boolean;
  salesperson?: boolean;
  items?: boolean;
  tagId?: boolean;
  actions?: boolean;
};
