
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Department } from "@/types/stations";

interface StationHeaderProps {
  department: Department | null;
  onBackClick: () => void;
}

export default function StationHeader({ department, onBackClick }: StationHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onBackClick}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h1 className="text-2xl font-bold">{department?.name} Department</h1>
    </div>
  );
}
