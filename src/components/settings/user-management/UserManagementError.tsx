
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserManagementErrorProps {
  error: Error | unknown;
}

export function UserManagementError({ error }: UserManagementErrorProps) {
  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          Error Loading Users
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">There was a problem loading the user data.</p>
        <p className="text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}
