import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { 
  Package, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  XCircle,
  Phone,
  MapPin,
  Calendar
} from "lucide-react";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type PickupRequest = Database['public']['Tables']['pickup_requests']['Row'];

export default function PartnerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isPartner, setIsPartner] = useState(false);
  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>([]);
  const [stats, setStats] = useState({
    totalPickups: 0,
    completedPickups: 0,
    pendingPickups: 0,
    totalWeight: 0,
  });

  useEffect(() => {
    checkPartnerAccess();
  }, [user]);

  const checkPartnerAccess = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      // Check if user is associated with a partner
      const response = await supabase
        .from("partners")
        .select("id")
        .eq("contact_email", user.email)
        .maybeSingle();

      if (response.error) throw response.error;

      const partnerData = response.data as { id: string } | null;

      if (partnerData) {
        setIsPartner(true);
        await fetchDashboardData(partnerData.id);
      } else {
        toast.error("Access denied: Partner account required");
        navigate("/");
      }
    } catch (error) {
      console.error("Error checking partner access:", error);
      toast.error("Error verifying access");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async (partnerId: string) => {
    try {
      // Fetch pickup requests
      const { data: pickups } = await supabase
        .from("pickup_requests")
        .select("*")
        .eq("partner_id", partnerId)
        .order("created_at", { ascending: false });

      if (pickups) {
        setPickupRequests(pickups);

        // Calculate stats
        const stats = pickups.reduce(
          (acc, pickup) => {
            acc.totalPickups++;
            if (pickup.status === "completed") acc.completedPickups++;
            if (pickup.status === "pending") acc.pendingPickups++;
            return acc;
          },
          { totalPickups: 0, completedPickups: 0, pendingPickups: 0, totalWeight: 0 }
        );
        setStats(stats);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const updatePickupStatus = async (pickupId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("pickup_requests")
        .update({ status })
        .eq("id", pickupId);

      if (error) throw error;

      toast.success(`Pickup ${status}!`);
      
      // Refresh data
      setPickupRequests(prev =>
        prev.map(p => (p.id === pickupId ? { ...p, status } : p))
      );
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isPartner) {
    return null;
  }

  const pendingRequests = pickupRequests.filter(p => p.status === "pending");
  const completedRequests = pickupRequests.filter(p => p.status === "completed");

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <div className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Partner Dashboard</h1>
            <p className="text-muted-foreground">
              Manage pickup requests and view your statistics
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalPickups}</p>
                    <p className="text-sm text-muted-foreground">Total Pickups</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.completedPickups}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.pendingPickups}</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalWeight} kg</p>
                    <p className="text-sm text-muted-foreground">Total Weight</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pickup Requests */}
          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList>
              <TabsTrigger value="pending" className="gap-2">
                <Clock className="h-4 w-4" />
                Pending ({pendingRequests.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Completed ({completedRequests.length})
              </TabsTrigger>
              <TabsTrigger value="all" className="gap-2">
                <Package className="h-4 w-4" />
                All ({pickupRequests.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {pendingRequests.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                    <p className="text-muted-foreground">No pending pickup requests</p>
                  </CardContent>
                </Card>
              ) : (
                pendingRequests.map((request) => (
                  <PickupRequestCard
                    key={request.id}
                    request={request}
                    onUpdateStatus={updatePickupStatus}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedRequests.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                    <p className="text-muted-foreground">No completed pickups yet</p>
                  </CardContent>
                </Card>
              ) : (
                completedRequests.map((request) => (
                  <PickupRequestCard
                    key={request.id}
                    request={request}
                    onUpdateStatus={updatePickupStatus}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              {pickupRequests.map((request) => (
                <PickupRequestCard
                  key={request.id}
                  request={request}
                  onUpdateStatus={updatePickupStatus}
                />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function PickupRequestCard({
  request,
  onUpdateStatus,
}: {
  request: PickupRequest;
  onUpdateStatus: (id: string, status: string) => void;
}) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
      confirmed: { label: "Confirmed", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
      completed: { label: "Completed", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
      cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Pickup Request</CardTitle>
          {getStatusBadge(request.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Item ID</p>
                <p className="text-sm text-muted-foreground font-mono">{request.item_id.slice(0, 8)}...</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Scheduled Date</p>
                <p className="text-sm text-muted-foreground">
                  {request.scheduled_date ? new Date(request.scheduled_date).toLocaleDateString() : 'Not scheduled'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Requested</p>
                <p className="text-sm text-muted-foreground">
                  {request.created_at ? new Date(request.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            {request.completed_date && (
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Completed</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(request.completed_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {request.status === "pending" && (
            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={() => onUpdateStatus(request.id, "confirmed")}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm
              </Button>
              <Button
                onClick={() => onUpdateStatus(request.id, "cancelled")}
                variant="outline"
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}

          {request.status === "confirmed" && (
            <div className="pt-4 border-t">
              <Button
                onClick={() => onUpdateStatus(request.id, "completed")}
                className="w-full"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Completed
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
