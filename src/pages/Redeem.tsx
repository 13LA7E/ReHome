import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, Gift, CheckCircle, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "@/hooks/use-toast";

interface Reward {
  id: string;
  name: string;
  description: string;
  points_required: number;
  type: string;
  image_url: string;
}

interface ImpactMetrics {
  community_points: number;
}

export default function Redeem() {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [qrData, setQrData] = useState<string | null>(null);
  const [redemptionId, setRedemptionId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      const [rewardsRes, metricsRes] = await Promise.all([
        supabase.from("rewards").select("*").eq("active", true).order("points_required"),
        supabase.from("impact_metrics").select("community_points").eq("user_id", user.id).single()
      ]);

      if (rewardsRes.data) setRewards(rewardsRes.data);
      if (metricsRes.data) setPoints(metricsRes.data.community_points);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load rewards",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (reward: Reward) => {
    if (!user || points < reward.points_required) {
      toast({
        title: "Insufficient Points",
        description: `You need ${reward.points_required} points to redeem this reward.`,
        variant: "destructive",
      });
      return;
    }

    try {
      const qrCodeData = JSON.stringify({
        userId: user.id,
        rewardId: reward.id,
        points: reward.points_required,
        timestamp: new Date().toISOString(),
      });

      const { data: redemption, error: redemptionError } = await supabase
        .from("redemptions")
        .insert({
          user_id: user.id,
          reward_id: reward.id,
          points_spent: reward.points_required,
          qr_code_data: qrCodeData,
          status: "pending",
        })
        .select()
        .single();

      if (redemptionError) throw redemptionError;

      const { error: updateError } = await supabase
        .from("impact_metrics")
        .update({ community_points: points - reward.points_required })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      setPoints(points - reward.points_required);
      setQrData(qrCodeData);
      setRedemptionId(redemption.id);
      setSelectedReward(reward);

      toast({
        title: "Reward Redeemed!",
        description: "Show this QR code to redeem your reward.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to redeem reward",
        variant: "destructive",
      });
    }
  };

  const downloadQR = () => {
    const svg = document.getElementById("qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `reward-${redemptionId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-glow-pulse text-primary text-xl">Loading rewards...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Redeem Rewards
              </h1>
              <Card className="px-6 py-3 bg-gradient-card border-primary/20">
                <div className="flex items-center gap-2">
                  <Coins className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Your Points</p>
                    <p className="text-2xl font-bold text-primary">{points}</p>
                  </div>
                </div>
              </Card>
            </div>
            <p className="text-muted-foreground">
              Convert your community points into real-world rewards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => {
              const canAfford = points >= reward.points_required;
              return (
                <Card
                  key={reward.id}
                  className="overflow-hidden hover-scale border-primary/10 bg-card/50 backdrop-blur"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={reward.image_url}
                      alt={reward.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge
                      className="absolute top-2 right-2 bg-primary/90 backdrop-blur"
                      variant="default"
                    >
                      {reward.points_required} pts
                    </Badge>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start gap-2 mb-2">
                      <Gift className="h-5 w-5 text-primary mt-1" />
                      <h3 className="font-semibold text-lg">{reward.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {reward.description}
                    </p>
                    <Button
                      variant="hero"
                      className="w-full"
                      onClick={() => handleRedeem(reward)}
                      disabled={!canAfford}
                    >
                      {canAfford ? "Redeem Now" : "Need More Points"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <Dialog open={!!qrData} onOpenChange={() => setQrData(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-primary" />
              Reward Redeemed!
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="bg-white p-4 rounded-lg">
              {qrData && (
                <QRCodeSVG
                  id="qr-code"
                  value={qrData}
                  size={200}
                  level="H"
                  includeMargin
                />
              )}
            </div>
            <div className="text-center">
              <p className="font-semibold mb-1">{selectedReward?.name}</p>
              <p className="text-sm text-muted-foreground">
                Show this QR code to redeem your reward
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={downloadQR}
            >
              <Download className="h-4 w-4 mr-2" />
              Download QR Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
