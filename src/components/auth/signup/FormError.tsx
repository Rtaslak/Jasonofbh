
import { CircleAlert } from "lucide-react";

interface FormErrorProps {
  error: string;
}

export default function FormError({ error }: FormErrorProps) {
  if (!error) return null;
  
  return (
    <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive flex items-center gap-2">
      <CircleAlert className="h-4 w-4" />
      <span>{error}</span>
    </div>
  );
}
