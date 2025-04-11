import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAgentStatus } from "@/hooks/useAgentStatus";

const SettingsPage = () => {
  const { status: agentStatus } = useAgentStatus();
  const [modelName, setModelName] = useState(agentStatus?.model || "llama3:8b");
  const [apiEndpoint, setApiEndpoint] = useState("http://localhost:5000");
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [autoRefreshData, setAutoRefreshData] = useState(false);

  const handleSaveSettings = () => {
    // In a real application, this would save settings to API or localStorage
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Settings" 
        description="Manage your application settings" 
      />
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Assistant Configuration</CardTitle>
            <CardDescription>
              Configure the AI model and connection settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="model-name">Default AI Model</Label>
              <Input
                id="model-name"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="llama3:8b"
              />
              <p className="text-sm text-muted-foreground">
                Enter the model name to use for AI analysis
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="api-endpoint">API Endpoint</Label>
              <Input
                id="api-endpoint"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                placeholder="http://localhost:5000"
              />
              <p className="text-sm text-muted-foreground">
                The backend API endpoint for the application
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Application Preferences</CardTitle>
            <CardDescription>
              Customize your application experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications for new tickets and updates
                </p>
              </div>
              <Switch
                id="notifications"
                checked={enableNotifications}
                onCheckedChange={setEnableNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-refresh">Auto Refresh Data</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically refresh ticket data every minute
                </p>
              </div>
              <Switch
                id="auto-refresh"
                checked={autoRefreshData}
                onCheckedChange={setAutoRefreshData}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
