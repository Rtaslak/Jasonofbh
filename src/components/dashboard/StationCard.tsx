
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/context/ThemeContext";

interface StationCardProps {
  name: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  count?: number;
  color?: string;
  selected?: boolean;
  departmentId?: number;
}

const departmentGradients: Record<number, { light: string, dark: string, iconColor: string, iconBackground: string }> = {
  1: { // Designers
    light: "bg-gradient-to-br from-blue-500/10 to-blue-600/5",
    dark: "bg-gradient-to-br from-blue-500/20 to-blue-600/10",
    iconColor: "text-blue-500",
    iconBackground: "bg-[#1A1F2C]"
  },
  2: { // Jewelers
    light: "bg-gradient-to-br from-amber-500/10 to-amber-600/5",
    dark: "bg-gradient-to-br from-amber-500/20 to-amber-600/10",
    iconColor: "text-amber-500",
    iconBackground: "bg-[#221F26]"
  },
  3: { // Setters
    light: "bg-gradient-to-br from-violet-500/10 to-violet-600/5",
    dark: "bg-gradient-to-br from-violet-500/20 to-violet-600/10",
    iconColor: "text-violet-500",
    iconBackground: "bg-[#1A1F2C]"
  },
  4: { // Polisher
    light: "bg-gradient-to-br from-emerald-500/10 to-emerald-600/5",
    dark: "bg-gradient-to-br from-emerald-500/20 to-emerald-600/10",
    iconColor: "text-emerald-500",
    iconBackground: "bg-[#222222]"
  },
  5: { // Diamond Counting
    light: "bg-gradient-to-br from-purple-500/10 to-purple-600/5",
    dark: "bg-gradient-to-br from-purple-500/20 to-purple-600/10",
    iconColor: "text-purple-500",
    iconBackground: "bg-[#2226]"
  },
  6: { // Shipping
    light: "bg-gradient-to-br from-rose-500/10 to-rose-600/5",
    dark: "bg-gradient-to-br from-rose-500/20 to-rose-600/10",
    iconColor: "text-rose-500",
    iconBackground: "bg-[#1d1111]"
  }
};

export default function StationCard({
  name,
  description,
  icon,
  className,
  onClick,
  count = 0,
  color,
  selected = false,
  departmentId,
}: StationCardProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  const gradientClasses = departmentId && departmentGradients[departmentId] 
    ? (isDarkMode ? departmentGradients[departmentId].dark : departmentGradients[departmentId].light)
    : "";
  
  const iconColorClass = departmentId && departmentGradients[departmentId]
    ? departmentGradients[departmentId].iconColor
    : "";

  const iconBoxBgClass = departmentId && departmentGradients[departmentId]
    ? (isDarkMode 
      ? departmentGradients[departmentId].iconBackground 
      : `${departmentGradients[departmentId].iconColor.replace('text', 'bg')}/20`)
    : "bg-foreground/20";

  return (
    <Card 
      className={cn(
        "department-card card-hover cursor-pointer transition-all duration-200", 
        gradientClasses,
        selected ? "ring-2 ring-primary" : "",
        className
      )}
      onClick={onClick}
    >
      <div 
        className="absolute top-0 right-0 w-16 h-16 rounded-full transform translate-x-1/2 -translate-y-1/2 
        opacity-0 bg-foreground/5"
      />

      <div className="absolute right-6 top-4 text-3xl font-bold text-foreground/70">
        {count}
      </div>

      <CardContent className="p-5 flex flex-col relative z-10">
        <div className="flex items-start mb-3">
          {icon && (
            <div className={cn(
              "w-10 h-10 rounded-md flex items-center justify-center mr-3", 
              iconBoxBgClass,
              "border border-border/30 shadow-sm"
            )}>
              <div className={cn("w-5 h-5 flex items-center justify-center", iconColorClass)}>
                {icon}
              </div>
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-medium text-foreground leading-tight">{name}</h3>
            {description && (
              <p className="text-sm text-muted-foreground leading-snug mt-0.5">{description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
