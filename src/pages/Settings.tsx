import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RfidSettings from '@/components/settings/RfidSettings';
import { UserManagement } from '@/components/settings/user-management/UserManagement';
import EnvironmentHelper from '@/components/admin/EnvironmentHelper';
import { Card } from '@/components/ui/card';
import { useAuthUser } from '@/hooks/useAuth';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('rfid');
  const { user } = useAuthUser();
  const isAdmin = user?.role === 'Administrator';
  const isOperator = user?.role === 'Operator';
  const isReadOnly = isOperator; // Operators have read-only access

  return (
    <div className="container py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings and RFID system configuration
        </p>
      </div>
      
      {isReadOnly && (
        <Alert variant="default" className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <AlertTitle>Read-only mode</AlertTitle>
          <AlertDescription>
            As an Operator, you can view settings but cannot make changes.
          </AlertDescription>
        </Alert>
      )}
      
      <Separator />
      
      <Tabs defaultValue="rfid" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="rfid">RFID System</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          {isAdmin && <TabsTrigger value="advanced">Advanced</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="rfid">
          <RfidSettings readOnly={isReadOnly} />
        </TabsContent>
        
        <TabsContent value="users">
          <UserManagement readOnly={isReadOnly} />
        </TabsContent>
        
        {isAdmin && (
          <TabsContent value="advanced">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">Advanced Settings</h2>
              <p className="text-muted-foreground">
                Advanced configuration options for administrators
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <EnvironmentHelper />
                
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Environment Variables</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Current environment: {
                      environmentUtils.isLovableEnvironment() ? 'Lovable Preview' :
                      environmentUtils.isTestEnvironment() ? 'Test Environment' :
                      environmentUtils.isLocalEnvironment() ? 'Local Development' :
                      'Production'
                    }
                  </p>
                  
                  <dl className="text-sm">
                    <div className="grid grid-cols-3 py-1">
                      <dt className="font-medium">RFID Server URL:</dt>
                      <dd className="col-span-2 truncate">{import.meta.env.VITE_RFID_SERVER_URL || 'not set'}</dd>
                    </div>
                  </dl>
                </Card>
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
