
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { PlusIcon, TrashIcon, RefreshCw } from 'lucide-react';
import rfidService from '@/services/rfidService';

// Department data
const departments = [
  { id: 1, name: "Designers" },
  { id: 2, name: "Jewelers" },
  { id: 3, name: "Setters" },
  { id: 4, name: "Polishers" },
  { id: 5, name: "Diamond Counting" },
  { id: 6, name: "Shipping" }
];

// Mapping type
interface TagMapping {
  id: string;
  tagId: string;
  departmentId: number;
  departmentName: string;
}

export default function TagToDepartmentMapping() {
  const [mappings, setMappings] = useState<TagMapping[]>([]);
  const [newTagId, setNewTagId] = useState('');
  const [newDepartmentId, setNewDepartmentId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load mappings from server on initial render
  useEffect(() => {
    loadMappings();

    // Set up socket listener for updated mappings
    const unsubscribe = rfidService.onConnectionStatusChange((status) => {
      if (status === 'connected') {
        loadMappings();
      }
    });

    return unsubscribe;
  }, []);

  const loadMappings = async () => {
    setIsLoading(true);
    try {
      // Fetch tag mappings from server API
      const data = await rfidService.getTagMappings();
      
      // Format mappings with department names
      const formattedMappings = data.map((mapping: any) => {
        const department = departments.find(d => d.id === mapping.departmentId);
        return {
          id: mapping.tagId, // Use tagId as id since it's unique
          tagId: mapping.tagId,
          departmentId: mapping.departmentId,
          departmentName: department?.name || 'Unknown Department'
        };
      });
      
      setMappings(formattedMappings);
    } catch (error) {
      console.error('Failed to load tag mappings', error);
      toast.error('Failed to load tag mappings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMapping = async () => {
    if (!newTagId || !newDepartmentId) {
      toast.error('Please enter a tag ID and select a department');
      return;
    }

    // Check for duplicate tag IDs
    if (mappings.some(mapping => mapping.tagId === newTagId)) {
      toast.error('This tag ID is already mapped');
      return;
    }

    const departmentName = departments.find(d => d.id === newDepartmentId)?.name || '';
    
    try {
      // Register tag on the server
      await rfidService.registerTagWithDepartment(newTagId, newDepartmentId);
      
      // Add to local state
      const newMapping: TagMapping = {
        id: newTagId,
        tagId: newTagId,
        departmentId: newDepartmentId,
        departmentName
      };
      
      setMappings([...mappings, newMapping]);
      toast.success('Tag mapping added');
      
      // Reset inputs
      setNewTagId('');
      setNewDepartmentId(null);
    } catch (error) {
      console.error('Failed to add tag mapping', error);
      toast.error('Failed to add tag mapping');
    }
  };

  const handleDeleteMapping = async (id: string) => {
    try {
      // For now, we don't have a server endpoint to delete mappings
      // This would normally call an API
      
      // Just update local state for now
      setMappings(mappings.filter(mapping => mapping.id !== id));
      toast.success('Tag mapping removed');
    } catch (error) {
      console.error('Failed to remove tag mapping', error);
      toast.error('Failed to remove tag mapping');
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>RFID Tag to Department Mapping</CardTitle>
          <CardDescription>
            Configure which department each RFID tag is associated with
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="icon"
          onClick={loadMappings}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="tag-id">Tag ID</Label>
            <Input
              id="tag-id"
              value={newTagId}
              onChange={(e) => setNewTagId(e.target.value)}
              placeholder="Enter tag ID"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select 
              value={newDepartmentId?.toString() || ''} 
              onValueChange={(value) => setNewDepartmentId(Number(value))}
            >
              <SelectTrigger id="department">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleAddMapping} 
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <PlusIcon className="h-4 w-4" />
            Add Mapping
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8 border rounded-md">
            <p className="text-muted-foreground">Loading tag mappings...</p>
          </div>
        ) : mappings.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-medium">Tag ID</th>
                  <th className="text-left p-3 font-medium">Department</th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mappings.map((mapping) => (
                  <tr key={mapping.id}>
                    <td className="p-3 font-mono text-xs">
                      {mapping.tagId}
                    </td>
                    <td className="p-3">
                      {mapping.departmentName}
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMapping(mapping.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex justify-center py-8 border rounded-md">
            <p className="text-muted-foreground">No tag mappings configured</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
