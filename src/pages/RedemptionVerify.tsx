import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Gift, ArrowLeft } from "lucide-react";
import { Navigation } from "@/components/Navigation";

interface RedemptionData {
  userId: string;
  rewardId: string;
  pointsSpent: number;
  redeemedAt: string;
}

const RedemptionVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [rewardName, setRewardName] = useState("");
  const [alreadyUsed, setAlreadyUsed] = useState(false);

  useEffect(() => {
    verifyRedemption();
  }, []);

  const verifyRedemption = async () => {
    try {
      const qrData = searchParams.get("data");
      
      if (!qrData) {
        setValid(false);
        setLoading(false);
        return;
      }

      const redemptionData: RedemptionData = JSON.parse(decodeURIComponent(qrData));
      
      // Verify redemption exists and get reward details
      const { data: redemption, error } = await supabase
        .from("redemptions")
        .select(`
          id,
          status,
          rewards (
            name,
            description
          )
        `)
        .eq("user_id", redemptionData.userId)
        .eq("reward_id", redemptionData.rewardId)
        .eq("qr_code_data", JSON.stringify(redemptionData))
        .maybeSingle();

      if (error) throw error;

      if (redemption) {
        setRewardName(redemption.rewards?.name || "Reward");
        
        if (redemption.status === "completed") {
          setAlreadyUsed(true);
          setValid(false);
        } else {
          setValid(true);
          
          // Mark as completed
          await supabase
            .from("redemptions")
            .update({ 
              status: "completed",
              redeemed_at: new Date().toISOString()
            })
            .eq("id", redemption.id);
        }
      } else {
        setValid(false);
      }
    } catch (error) {
      console.error("Verification error:", error);
      setValid(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Loader2 className="w-16 h-16 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card className="border-2 shadow-elegant animate-scale-in">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-6">
              <div className={`p-6 rounded-full ${valid ? 'bg-green-500/10' : alreadyUsed ? 'bg-yellow-500/10' : 'bg-red-500/10'}`}>
                {valid ? (
                  <CheckCircle className="w-20 h-20 text-green-500" />
                ) : alreadyUsed ? (
                  <Gift className="w-20 h-20 text-yellow-500" />
                ) : (
                  <XCircle className="w-20 h-20 text-red-500" />
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="text-center space-y-6 pb-8">
            {valid ? (
              <>
                <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                  REDEEMED!
                </h1>
                <p className="text-xl text-muted-foreground">
                  Your <span className="font-semibold text-foreground">{rewardName}</span> has been successfully redeemed!
                </p>
                <div className="pt-4">
                  <div className="inline-block px-6 py-3 bg-green-500/10 border-2 border-green-500/30 rounded-full">
                    <p className="text-green-600 dark:text-green-400 font-semibold">
                      ✨ Enjoy your reward!
                    </p>
                  </div>
                </div>
              </>
            ) : alreadyUsed ? (
              <>
                <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent">
                  ALREADY USED
                </h1>
                <p className="text-xl text-muted-foreground">
                  This <span className="font-semibold text-foreground">{rewardName}</span> has already been redeemed.
                </p>
                <div className="pt-4">
                  <div className="inline-block px-6 py-3 bg-yellow-500/10 border-2 border-yellow-500/30 rounded-full">
                    <p className="text-yellow-600 dark:text-yellow-400 font-semibold">
                      This QR code cannot be used again
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                  INVALID CODE
                </h1>
                <p className="text-xl text-muted-foreground">
                  This QR code is not valid or has expired.
                </p>
                <div className="pt-4">
                  <div className="inline-block px-6 py-3 bg-red-500/10 border-2 border-red-500/30 rounded-full">
                    <p className="text-red-600 dark:text-red-400 font-semibold">
                      Please contact support if you believe this is an error
                    </p>
                  </div>
                </div>
              </>
            )}

            <div className="pt-8">
              <Button
                size="lg"
                onClick={() => navigate("/")}
                className="font-display font-semibold"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RedemptionVerify;