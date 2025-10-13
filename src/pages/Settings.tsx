import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/components/AuthProvider";
import { Moon, Sun, User, Bell, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleSavePreferences = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/30 to-background">
      <Navigation />
      <div className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-12 space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Settings
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage your account preferences and settings
            </p>
          </div>

          <div className="space-y-6">
            {/* Appearance Settings */}
            <Card className="p-6 shadow-soft animate-slide-up">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                    {theme === "dark" ? (
                      <Moon className="w-6 h-6 text-primary" />
                    ) : (
                      <Sun className="w-6 h-6 text-primary" />
                    )}
                    Appearance
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Customize how ReHome looks on your device
                  </p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="dark-mode" className="text-base font-medium">
                      Dark Mode
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {theme === "dark" 
                        ? "Switch to light mode for a brighter experience"
                        : "Switch to dark mode for a comfortable viewing experience"
                      }
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={theme === "dark"}
                    onCheckedChange={toggleTheme}
                  />
                </div>
              </div>
            </Card>

            {/* Account Settings */}
            <Card className="p-6 shadow-soft animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                    <User className="w-6 h-6 text-primary" />
                    Account
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your account information
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your email address is verified and cannot be changed
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Notification Settings */}
            <Card className="p-6 shadow-soft animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                    <Bell className="w-6 h-6 text-primary" />
                    Notifications
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Manage how you receive updates
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="push-notifications" className="text-base font-medium">
                        Push Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about donation pickups and rewards
                      </p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={notifications}
                      onCheckedChange={setNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="email-notifications" className="text-base font-medium">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates and newsletters via email
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Privacy Settings */}
            <Card className="p-6 shadow-soft animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                    <Lock className="w-6 h-6 text-primary" />
                    Privacy & Security
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Control your privacy and security settings
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                    Delete Account
                  </Button>
                </div>
              </div>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <Button 
                size="lg" 
                onClick={handleSavePreferences}
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
              >
                Save Preferences
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
