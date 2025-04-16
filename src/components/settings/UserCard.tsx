
import { User, UserUpdateInput } from "@/types/users";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserCardProps {
  user: User;
  onEdit?: (id: string) => void;  // Updated to only accept an id parameter
  onDelete?: (id: string) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
  readOnly?: boolean;
}

export function UserCard({ 
  user, 
  onEdit, 
  onDelete, 
  isUpdating = false, 
  isDeleting = false,
  readOnly = false
}: UserCardProps) {
  const initials = user.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 overflow-hidden">
          <h3 className="font-semibold text-lg">{user.name}</h3>
          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-1 text-sm">
          <div className="text-muted-foreground">Role</div>
          <div>{user.role}</div>
          
          {user.phone && (
            <>
              <div className="text-muted-foreground">Phone</div>
              <div>{user.phone}</div>
            </>
          )}
          
          <div className="text-muted-foreground">Created</div>
          <div>{new Date(user.createdAt).toLocaleDateString()}</div>
        </div>
      </CardContent>
      
      {!readOnly && (
        <CardFooter className="flex justify-end gap-2 pt-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(user.id)}
              disabled={isUpdating || isDeleting}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
          
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(user.id)}
              disabled={isUpdating || isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
