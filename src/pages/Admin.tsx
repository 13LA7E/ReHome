import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  MessageSquare, 
  Users, 
  Bell, 
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Check,
  X
} from "lucide-react";
import { toast } from "sonner";

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (data?.role === "admin") {
        setIsAdmin(true);
      } else {
        toast.error("Access denied: Admin privileges required");
        navigate("/");
      }
    } catch (error) {
      console.error("Error checking admin access:", error);
      toast.error("Error verifying access");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Verifying access...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <div className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage content, users, and platform settings
            </p>
          </div>

          <Tabs defaultValue="blog" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto">
              <TabsTrigger value="blog" className="gap-2">
                <FileText className="h-4 w-4" />
                Blog
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Testimonials
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Blog Management */}
            <TabsContent value="blog" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Blog Posts</CardTitle>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      New Post
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" placeholder="Post title" />

                      <Label htmlFor="slug">Slug</Label>
                      <Input id="slug" placeholder="post-slug" />

                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea id="excerpt" placeholder="Brief description" />

                      <Label htmlFor="content">Content (HTML)</Label>
                      <Textarea 
                        id="content" 
                        placeholder="<p>Post content...</p>" 
                        rows={10}
                      />

                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input id="tags" placeholder="news, announcement, update" />

                      <Label htmlFor="image">Featured Image URL</Label>
                      <Input id="image" placeholder="https://..." />

                      <div className="flex items-center gap-2">
                        <Switch id="published" />
                        <Label htmlFor="published">Published</Label>
                      </div>

                      <Button className="w-full">
                        Create Post
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Existing Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-muted-foreground py-8">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>No blog posts yet. Create your first post above!</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Testimonials Management */}
            <TabsContent value="testimonials" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Testimonials</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-muted-foreground py-8">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>No pending testimonials to review</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Management */}
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-primary/10 rounded-lg">
                      <p className="text-3xl font-bold">0</p>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                    </div>
                    <div className="text-center p-6 bg-green-100 dark:bg-green-900 rounded-lg">
                      <p className="text-3xl font-bold">0</p>
                      <p className="text-sm text-muted-foreground">Active This Month</p>
                    </div>
                    <div className="text-center p-6 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <p className="text-3xl font-bold">0</p>
                      <p className="text-sm text-muted-foreground">New This Week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Send Notification</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="notif-title">Title</Label>
                      <Input id="notif-title" placeholder="Notification title" />
                    </div>

                    <div>
                      <Label htmlFor="notif-message">Message</Label>
                      <Textarea 
                        id="notif-message" 
                        placeholder="Notification message" 
                      />
                    </div>

                    <div>
                      <Label htmlFor="notif-type">Type</Label>
                      <select 
                        id="notif-type"
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="info">Info</option>
                        <option value="success">Success</option>
                        <option value="warning">Warning</option>
                        <option value="achievement">Achievement</option>
                      </select>
                    </div>

                    <Button className="w-full">
                      <Bell className="h-4 w-4 mr-2" />
                      Send to All Users
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics */}
            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-6 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Total Donations</p>
                      <p className="text-3xl font-bold">0</p>
                    </div>
                    <div className="p-6 bg-green-100 dark:bg-green-900 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Total Impact</p>
                      <p className="text-3xl font-bold">0 kg</p>
                    </div>
                    <div className="p-6 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Active Partners</p>
                      <p className="text-3xl font-bold">0</p>
                    </div>
                    <div className="p-6 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Points Distributed</p>
                      <p className="text-3xl font-bold">0</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
}
