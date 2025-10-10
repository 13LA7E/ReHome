import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Navigation } from "@/components/Navigation";
import { Loader2, Coins, TreePine, Store, Gift, ArrowRight, Sparkles } from "lucide-react";
import QRCode from "qrcode.react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Reward {
  id: string;
  name: string;
  description: string;
  points_required: number;
  type: string;
  image_url?: string;
  partner_id?: string;
}

const Redeem = () => {
  const navigate = useNavigate();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: metricsData } = await supabase
        .from("impact_metrics")
        .select("community_points")
        .eq("user_id", user.id)
        .maybeSingle();

      setUserPoints(metricsData?.community_points || 0);

      const { data: rewardsData } = await supabase
        .from("rewards")
        .select("*")
        .in("type", ["tree_planting", "discount"])
        .eq("active", true);

      setRewards(rewardsData || []);
    } catch (error) {
      toast.error("Failed to load rewards");
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (reward: Reward) => {
    if (userPoints < reward.points_required) {
      toast.error("Not enough points!");
      return;
    }

    setRedeeming(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const qrData = JSON.stringify({
        userId: user.id,
        rewardId: reward.id,
        pointsSpent: reward.points_required,
        redeemedAt: new Date().toISOString(),
      });

      await supabase.from("redemptions").insert({
        user_id: user.id,
        reward_id: reward.id,
        points_spent: reward.points_required,
        qr_code_data: qrData,
      });

      await supabase
        .from("impact_metrics")
        .update({ community_points: userPoints - reward.points_required })
        .eq("user_id", user.id);

      setQrCodeData(qrData);
      setSelectedReward(reward);
      setShowQRDialog(true);
      setUserPoints(userPoints - reward.points_required);
      toast.success("Reward redeemed!");
    } catch (error) {
      toast.error("Failed to redeem");
    } finally {
      setRedeeming(false);
    }
  };

  const qatarRiyals = (userPoints / 100).toFixed(2);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Navigation />
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <Card className="mb-12 border-2 border-primary/20 shadow-lg">
          <CardHeader className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent">
                <Coins className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-4xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Your Rewards Balance
                </CardTitle>
                <CardDescription className="text-lg">Redeem points for rewards</CardDescription>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20">
                <p className="text-sm text-muted-foreground mb-2">Community Points</p>
                <p className="text-6xl font-display font-bold text-primary">{userPoints}</p>
              </div>
              <div className="p-6 rounded-2xl bg-accent/10 border border-accent/20">
                <p className="text-sm text-muted-foreground mb-2">Equivalent Value</p>
                <p className="text-6xl font-display font-bold text-accent">{qatarRiyals} <span className="text-2xl">QAR</span></p>
                <p className="text-xs text-muted-foreground mt-2">100 points = 1 QAR</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-display font-bold">Available Rewards</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {rewards.map(reward => {
              const canAfford = userPoints >= reward.points_required;
              return (
                <Card key={reward.id} className={`group ${canAfford ? "border-2 border-primary/30 hover:border-primary" : "opacity-60"}`}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${reward.type === "tree_planting" ? "bg-gradient-to-br from-green-500 to-emerald-500" : "bg-gradient-to-br from-purple-500 to-pink-500"}`}>
                        {reward.type === "tree_planting" ? <TreePine className="w-6 h-6 text-white" /> : <Store className="w-6 h-6 text-white" />}
                      </div>
                      <CardTitle className="text-2xl font-display">{reward.name}</CardTitle>
                    </div>
                    <CardDescription className="text-base">{reward.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10">
                      <div>
                        <p className="text-sm text-muted-foreground">Cost</p>
                        <p className="text-3xl font-display font-bold text-primary">{reward.points_required} <span className="text-sm">pts</span></p>
                        <p className="text-xs text-muted-foreground">≈ {(reward.points_required / 100).toFixed(2)} QAR</p>
                      </div>
                      <Button onClick={() => handleRedeem(reward)} disabled={!canAfford || redeeming} size="lg" className="font-display">
                        {canAfford ? <></>Redeem <ArrowRight className="w-4 h-4 ml-2" /></> : "Need More"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-display text-center">Reward Redeemed! 🎉</DialogTitle>
            <DialogDescription className="text-center">Show this QR code to redeem</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center p-6 bg-white rounded-xl">
            {qrCodeData && <QRCode value={qrCodeData} size={256} />}
          </div>
          <Button onClick={() => setShowQRDialog(false)} className="w-full font-display">Done</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Redeem;
