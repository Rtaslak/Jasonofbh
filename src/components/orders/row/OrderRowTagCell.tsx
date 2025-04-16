
interface OrderRowTagCellProps {
  tagId?: string;
}

export function OrderRowTagCell({ tagId }: OrderRowTagCellProps) {
  if (tagId) {
    return <code className="px-1 py-0.5 bg-secondary/50 rounded text-xs">{tagId}</code>;
  }
  
  return <span className="text-muted-foreground text-xs">No tag</span>;
}
