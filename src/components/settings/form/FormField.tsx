
import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LucideIcon } from "lucide-react";

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  className?: string;
  error?: string;
  icon?: LucideIcon;
}

export function FormField({
  id,
  label,
  value,
  onChange,
  type = "text",
  required = false,
  className = "",
  error,
  icon: Icon
}: FormFieldProps) {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id} className="text-right">
        {label}
      </Label>
      <div className="col-span-3 relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <Icon size={18} />
          </div>
        )}
        <Input
          id={id}
          type={type}
          className={`${className} ${Icon ? 'pl-10' : ''} ${error ? "border-red-500" : ""}`}
          value={value}
          onChange={onChange}
          required={required}
        />
        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>
    </div>
  );
}
