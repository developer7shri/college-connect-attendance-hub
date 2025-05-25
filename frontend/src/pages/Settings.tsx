
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Bell, Mail, Moon, Sun } from "lucide-react";

const Settings = () => {
  const { authState } = useAuth();
  const { user } = authState;
  const [darkMode, setDarkMode] = useState(false);

  const [accountForm, setAccountForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "",
    department: user?.department || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [notifications, setNotifications] = useState({
    attendance: true,
    email: true,
    leave: true,
    mentoring: true,
  });

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAccountForm(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [id.replace('-', '')]: value
    }));
  };

  const handleNotificationToggle = (id: string) => {
    setNotifications(prev => ({
      ...prev,
      [id.replace('-notifications', '')]: !prev[id.replace('-notifications', '') as keyof typeof prev]
    }));
  };

  const handleSaveNotifications = () => {
    toast.success("Notification settings saved successfully");
  };

  const handleSaveAppearance = () => {
    setDarkMode(!darkMode);
    toast.success("Appearance settings saved successfully");
    // In a real app, we would apply dark mode to the entire app here
  };

  const handleSaveAccount = () => {
    toast.success("Account settings saved successfully");
  };

  const handleUpdatePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("Password should be at least 6 characters long");
      return;
    }
    toast.success("Password updated successfully");
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Update your account information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Label htmlFor="name" className="text-right md:pt-2">Name</Label>
                  <Input
                    id="name"
                    className="col-span-3"
                    value={accountForm.name}
                    onChange={handleAccountChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Label htmlFor="email" className="text-right md:pt-2">Email</Label>
                  <Input
                    id="email"
                    className="col-span-3"
                    value={accountForm.email}
                    disabled
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Label htmlFor="role" className="text-right md:pt-2">Role</Label>
                  <Input
                    id="role"
                    className="col-span-3"
                    value={accountForm.role.charAt(0).toUpperCase() + accountForm.role.slice(1)}
                    disabled
                  />
                </div>
                {user?.department && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Label htmlFor="department" className="text-right md:pt-2">Department</Label>
                    <Input
                      id="department"
                      className="col-span-3"
                      value={accountForm.department}
                      disabled
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveAccount}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Label htmlFor="current-password" className="text-right md:pt-2">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    className="col-span-3"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Label htmlFor="new-password" className="text-right md:pt-2">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    className="col-span-3"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Label htmlFor="confirm-password" className="text-right md:pt-2">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    className="col-span-3"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleUpdatePassword}>
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6">
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4" />
                    <Label htmlFor="attendance-notifications">Attendance Notifications</Label>
                  </div>
                  <Switch 
                    id="attendance-notifications" 
                    checked={notifications.attendance}
                    onCheckedChange={() => handleNotificationToggle('attendance-notifications')}
                  />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={notifications.email}
                    onCheckedChange={() => handleNotificationToggle('email-notifications')}
                  />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4" />
                    <Label htmlFor="leave-notifications">Leave Request Notifications</Label>
                  </div>
                  <Switch 
                    id="leave-notifications" 
                    checked={notifications.leave}
                    onCheckedChange={() => handleNotificationToggle('leave-notifications')}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4" />
                    <Label htmlFor="mentoring-notifications">Mentoring Notifications</Label>
                  </div>
                  <Switch 
                    id="mentoring-notifications" 
                    checked={notifications.mentoring}
                    onCheckedChange={() => handleNotificationToggle('mentoring-notifications')}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={handleSaveNotifications}>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the appearance of the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6">
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4" />
                    <Label htmlFor="theme-mode">Light Mode / Dark Mode</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4 text-muted-foreground" />
                    <Switch 
                      id="theme-mode" 
                      checked={darkMode} 
                      onCheckedChange={() => setDarkMode(!darkMode)}
                    />
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={handleSaveAppearance}>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
