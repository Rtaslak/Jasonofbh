
import { format } from "date-fns";

interface DateFormatterProps {
  dateString: string | undefined;
}

export function DateFormatter({ dateString }: DateFormatterProps) {
  if (!dateString) return "—";
  
  try {
    return format(new Date(dateString), 'MM-dd-yyyy');
  } catch (error) {
    return dateString;
  }
}
