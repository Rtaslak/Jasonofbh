
import { Button } from "@/components/ui/button";
import { PlusCircle, List, Grid } from "lucide-react";

interface UserManagementHeaderProps {
  onCreateClick: () => void;
  viewMode: 'table' | 'card';
  setViewMode: (mode: 'table' | 'card') => void;
  isCreating: boolean;
  readOnly?: boolean;
}

export function UserManagementHeader({ 
  onCreateClick, 
  viewMode, 
  setViewMode, 
  isCreating,
  readOnly = false
}: UserManagementHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-medium">User Management</h3>
      <div className="flex gap-2">
        <div className="bg-muted rounded-md p-1 flex">
          <Button
            variant="ghost"
            size="sm"
            className={`px-2 ${viewMode === 'table' ? 'bg-background shadow-sm' : ''}`}
            onClick={() => setViewMode('table')}
            aria-label="Table view"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`px-2 ${viewMode === 'card' ? 'bg-background shadow-sm' : ''}`}
            onClick={() => setViewMode('card')}
            aria-label="Card view"
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
        {!readOnly && (
          <Button 
            variant="default" 
            onClick={onCreateClick}
            disabled={isCreating}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add User</span>
          </Button>
        )}
      </div>
    </div>
  );
}
