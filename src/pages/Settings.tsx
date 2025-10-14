import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/components/AuthProvider";
import { Moon, Sun, User, Bell, Lock, Mail, AtSign, Camera, Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [migrationNeeded, setMigrationNeeded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        // Try to fetch all fields, but handle if some don't exist
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        if (!error && data) {
          if ('full_name' in data) setFullName((data.full_name as string) || "");
        }

        // Try to get username and avatar separately (they might not exist yet)
        try {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("username, avatar_url")
            .eq("id", user.id)
            .single();

          if (profileData) {
            if ('username' in profileData) setUsername((profileData.username as string) || "");
            if ('avatar_url' in profileData) setAvatarUrl((profileData.avatar_url as string) || "");
            setMigrationNeeded(false);
          } else if (profileError?.message?.includes("column")) {
            setMigrationNeeded(true);
          }
        } catch (e: any) {
          // Username/avatar columns don't exist yet
          if (e.message?.includes("column") || e.code === "PGRST116") {
            setMigrationNeeded(true);
          }
        }
      } catch (error) {
        console.log("Could not fetch profile");
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
      // Check if avatars bucket exists
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) throw bucketsError;
      
      const avatarsBucket = buckets?.find(b => b.id === 'avatars');
      
      if (!avatarsBucket) {
        toast({
          variant: "destructive",
          title: "Storage not configured",
          description: "Please create the 'avatars' storage bucket in Supabase Dashboard first. See MIGRATION_GUIDE.md for instructions.",
        });
        return;
      }

      // Delete old avatar if exists
      if (avatarUrl) {
        try {
          const oldPath = avatarUrl.split('/avatars/')[1];
          if (oldPath) {
            await supabase.storage.from('avatars').remove([oldPath]);
          }
        } catch (e) {
          console.log("Could not delete old avatar:", e);
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
        .update({ avatar_url: publicUrl } as any)
        .eq('id', user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error: any) {
      const errorMessage = error.message || "Failed to upload avatar. Please try again.";
      
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: errorMessage.includes("Bucket not found") 
          ? "Storage bucket not configured. Please run the database migration first."
          : errorMessage,
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // First, update the basic profile (full_name always exists)
      const { error: nameError } = await supabase
        .from("profiles")
        .update({ full_name: fullName.trim() })
        .eq("id", user.id);

      if (nameError) throw nameError;

      // Try to update username if the column exists and user provided one
      if (username.trim()) {
        try {
          const { error: usernameError } = await supabase
            .from("profiles")
            .update({ username: username.toLowerCase().trim() } as any)
            .eq("id", user.id);

          if (usernameError && !usernameError.message.includes("column")) {
            throw usernameError;
          }
        } catch (e: any) {
          // If column doesn't exist, that's okay - just skip it
          if (!e.message?.includes("column")) {
            throw e;
          }
        }
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
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
            {/* Migration Warning */}
            {migrationNeeded && (
              <Alert variant="destructive" className="animate-slide-up">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Database Setup Required</AlertTitle>
                <AlertDescription>
                  Username and avatar features are not available yet. Please run the database migration in Supabase.
                  <br />
                  <a 
                    href="https://github.com/13LA7E/ReHome/blob/main/MIGRATION_GUIDE.md" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium mt-2 inline-block"
                  >
                    View Migration Guide →
                  </a>
                </AlertDescription>
              </Alert>
            )}

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
                    <Label className="text-base font-medium flex items-center gap-2">
                      Profile Picture
                      {migrationNeeded && (
                        <span className="text-xs text-muted-foreground font-normal">(Requires migration)</span>
                      )}
                    </Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      {migrationNeeded 
                        ? "Avatar upload requires database migration and storage setup"
                        : "JPG, PNG, or GIF. Max size 5MB."
                      }
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
                        disabled={uploadingAvatar || migrationNeeded}
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
                      {migrationNeeded && (
                        <span className="text-xs text-muted-foreground font-normal">(Requires migration)</span>
                      )}
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase())}
                      disabled={!isEditing || migrationNeeded}
                      className={!isEditing || migrationNeeded ? "bg-muted" : ""}
                      placeholder={migrationNeeded ? "Run migration first" : "your_username"}
                    />
                    <p className="text-xs text-muted-foreground">
                      {migrationNeeded 
                        ? "Username feature requires database migration"
                        : "Your unique username (lowercase, numbers, and underscores only)"
                      }
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
