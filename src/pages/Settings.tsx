import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/components/AuthProvider";
import { Moon, Sun, User, Bell, Lock, Mail, AtSign, Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("username, full_name, avatar_url")
          .eq("id", user.id)
          .single();

        if (!error && data) {
          if ('username' in data) setUsername((data.username as string) || "");
          if ('full_name' in data) setFullName((data.full_name as string) || "");
          if ('avatar_url' in data) setAvatarUrl((data.avatar_url as string) || "");
        }
      } catch (error) {
        console.log("Profile fields not available yet");
      }
    };

    fetchProfile();
  }, [user]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Avatar must be less than 5MB",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file",
      });
      return;
    }

    setUploadingAvatar(true);

    try {
      // Delete old avatar if exists
      if (avatarUrl) {
        const oldPath = avatarUrl.split('/').pop();
        if (oldPath) {
          await supabase.storage.from('avatars').remove([`${user.id}/${oldPath}`]);
        }
      }

      // Upload new avatar
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to upload avatar. Please try again.",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const updateData: any = {
        full_name: fullName.trim()
      };

      // Only add username if it's not empty
      if (username.trim()) {
        updateData.username = username.toLowerCase().trim();
      }

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } else {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
        setIsEditing(false);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                      <User className="w-6 h-6 text-primary" />
                      Account
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Manage your account information
                    </p>
                  </div>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>

                <Separator />

                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={avatarUrl} alt={fullName || "User"} />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {fullName ? getInitials(fullName) : <User className="w-12 h-12" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Label className="text-base font-medium">Profile Picture</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      JPG, PNG, or GIF. Max size 5MB.
                    </p>
                    <div className="flex gap-2">
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingAvatar}
                      >
                        {uploadingAvatar ? (
                          <>
                            <Upload className="w-4 h-4 mr-2 animate-pulse" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Camera className="w-4 h-4 mr-2" />
                            Change Avatar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullname" className="text-base font-medium flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </Label>
                    <Input
                      id="fullname"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-base font-medium flex items-center gap-2">
                      <AtSign className="w-4 h-4" />
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase())}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                      placeholder="your_username"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your unique username (lowercase, numbers, and underscores only)
                    </p>
                  </div>

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

                  {isEditing && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          // Reset to original values if needed
                        }}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
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
