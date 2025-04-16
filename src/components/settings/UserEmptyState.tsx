
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface UserEmptyStateProps {
  onCreateClick: () => void;
}

export function UserEmptyState({ onCreateClick }: UserEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 border rounded-md bg-muted/30 space-y-4">
      <div className="bg-primary/10 rounded-full p-4 text-primary">
        <UserPlus size={32} />
      </div>
      <div className="space-y-2">
        <h3 className="font-medium text-xl">No users found</h3>
        <p className="text-muted-foreground max-w-sm">
          You haven't created any users yet. Add your first user to get started with the system.
        </p>
      </div>
      <Button 
        onClick={onCreateClick}
        className="mt-2"
        size="lg"
      >
        <UserPlus className="mr-2 h-5 w-5" />
        Create First User
      </Button>
    </div>
  );
}
