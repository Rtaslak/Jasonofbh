
interface OrderRowItemsCellProps {
  items?: string[];
}

export function OrderRowItemsCell({ items }: OrderRowItemsCellProps) {
  return (
    <span className="text-sm text-muted-foreground">
      {items && items.length > 0 ? items.join(", ") : "—"}
    </span>
  );
}
