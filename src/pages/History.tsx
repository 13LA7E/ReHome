import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Package, Calendar, CheckCircle, Clock, Truck, Loader2, Filter, ImageIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DonationItem {
  id: string;
  category: string;
  image_url: string;
  status: string;
  created_at: string;
  confidence: number;
  is_reusable: boolean;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  pending: { label: "Pending", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", icon: Clock },
  scheduled: { label: "Scheduled", color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: Calendar },
  picked_up: { label: "Picked Up", color: "bg-purple-500/10 text-purple-600 border-purple-500/20", icon: Truck },
  donated: { label: "Donated", color: "bg-green-500/10 text-green-600 border-green-500/20", icon: CheckCircle },
};

const categoryEmoji: Record<string, string> = {
  clothes: "👕",
  books: "📚",
  electronics: "📱",
  furniture: "🪑",
  ewaste: "♻️",
};

const History = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<DonationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStats = () => {
    return {
      total: items.length,
      pending: items.filter((i) => i.status === "pending").length,
      donated: items.filter((i) => i.status === "donated").length,
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
        <Navigation />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 space-y-4 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Donation History
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Track all your donations and their current status
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8 animate-slide-up">
          <Card className="text-center p-4 shadow-lg">
            <p className="text-3xl font-bold text-primary">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Items</p>
          </Card>
          <Card className="text-center p-4 shadow-lg">
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </Card>
          <Card className="text-center p-4 shadow-lg">
            <p className="text-3xl font-bold text-green-600">{stats.donated}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex items-center justify-between mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter by status:</span>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="picked_up">Picked Up</SelectItem>
              <SelectItem value="donated">Donated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Items List */}
        {filteredItems.length === 0 ? (
          <Card className="p-12 text-center animate-fade-in">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No donations yet</h3>
            <p className="text-muted-foreground mb-4">
              Start your donation journey by uploading your first item!
            </p>
            <Button onClick={() => window.location.href = "#/multi-upload"}>
              Donate Now
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            {filteredItems.map((item, index) => {
              const status = statusConfig[item.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              
              return (
                <Card 
                  key={item.id} 
                  className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Image */}
                  <div className="relative h-48 bg-secondary">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.category}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    <Badge 
                      className={`absolute top-3 right-3 ${status.color}`}
                    >
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{categoryEmoji[item.category] || "📦"}</span>
                        <h3 className="font-semibold capitalize text-lg">{item.category}</h3>
                      </div>
                      <Badge variant={item.is_reusable ? "default" : "secondary"}>
                        {item.is_reusable ? "Reusable" : "Recyclable"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(item.created_at)}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">AI Confidence</span>
                      <span className="font-medium text-primary">
                        {item.confidence ? `${(item.confidence * 100).toFixed(0)}%` : "N/A"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
