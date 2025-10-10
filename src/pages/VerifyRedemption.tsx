import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Loader2, Gift, Scan } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { toast } from "sonner";

interface RedemptionData {
  userId: string;
  rewardId: string;
  pointsSpent: number;
  redeemedAt: string;
}

const VerifyRedemption = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    rewardName: string;
    alreadyUsed: boolean;
  } | null>(null);

  const verifyCode = async () => {
    if (!code.trim()) {
      toast.error("Please enter a code");
      return;
    }

    setLoading(true);
    setVerificationResult(null);

    try {
      const redemptionData: RedemptionData = JSON.parse(code);
      
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
        .eq("qr_code_data", code)
        .maybeSingle();

      if (error) throw error;

      if (redemption) {
        const rewardName = redemption.rewards?.name || "Reward";
        
        if (redemption.status === "completed") {
          setVerificationResult({
            valid: false,
            rewardName,
            alreadyUsed: true,
          });
          toast.error("This code has already been used!");
        } else {
          // Mark as completed
          await supabase
            .from("redemptions")
            .update({ 
              status: "completed",
              redeemed_at: new Date().toISOString()
            })
            .eq("id", redemption.id);

          setVerificationResult({
            valid: true,
            rewardName,
            alreadyUsed: false,
          });
          toast.success("Redemption verified successfully!");
        }
      } else {
        setVerificationResult({
          valid: false,
          rewardName: "",
          alreadyUsed: false,
        });
        toast.error("Invalid redemption code!");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationResult({
        valid: false,
        rewardName: "",
        alreadyUsed: false,
      });
      toast.error("Invalid code format!");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCode("");
    setVerificationResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card className="border-2 shadow-elegant">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-primary/10">
                <Scan className="w-12 h-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Verify Redemption
            </CardTitle>
            <CardDescription className="text-lg">
              Scan the QR code or paste the redemption code below
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {!verificationResult ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Redemption Code</label>
                  <Input
                    placeholder="Paste QR code data here..."
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="font-mono text-sm"
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Scan the user's QR code with your phone and paste the data here
                  </p>
                </div>

                <Button
                  onClick={verifyCode}
                  disabled={loading || !code.trim()}
                  className="w-full font-display font-semibold"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Scan className="w-5 h-5 mr-2" />
                      Verify Code
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="space-y-6 text-center">
                <div className="flex justify-center">
                  <div className={`p-6 rounded-full ${
                    verificationResult.valid 
                      ? 'bg-green-500/10' 
                      : verificationResult.alreadyUsed 
                        ? 'bg-yellow-500/10' 
                        : 'bg-red-500/10'
                  }`}>
                    {verificationResult.valid ? (
                      <CheckCircle className="w-16 h-16 text-green-500" />
                    ) : verificationResult.alreadyUsed ? (
                      <Gift className="w-16 h-16 text-yellow-500" />
                    ) : (
                      <XCircle className="w-16 h-16 text-red-500" />
                    )}
                  </div>
                </div>

                {verificationResult.valid ? (
                  <>
                    <h2 className="text-4xl font-display font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                      REDEEMED!
                    </h2>
                    <p className="text-xl text-muted-foreground">
                      <span className="font-semibold text-foreground">{verificationResult.rewardName}</span> has been successfully redeemed!
                    </p>
                    <div className="inline-block px-6 py-3 bg-green-500/10 border-2 border-green-500/30 rounded-full">
                      <p className="text-green-600 dark:text-green-400 font-semibold">
                        ✨ Reward verified and completed
                      </p>
                    </div>
                  </>
                ) : verificationResult.alreadyUsed ? (
                  <>
                    <h2 className="text-4xl font-display font-bold bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent">
                      ALREADY USED
                    </h2>
                    <p className="text-xl text-muted-foreground">
                      <span className="font-semibold text-foreground">{verificationResult.rewardName}</span> has already been redeemed
                    </p>
                    <div className="inline-block px-6 py-3 bg-yellow-500/10 border-2 border-yellow-500/30 rounded-full">
                      <p className="text-yellow-600 dark:text-yellow-400 font-semibold">
                        This code cannot be used again
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-4xl font-display font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                      INVALID CODE
                    </h2>
                    <p className="text-xl text-muted-foreground">
                      This code is not valid or has expired
                    </p>
                    <div className="inline-block px-6 py-3 bg-red-500/10 border-2 border-red-500/30 rounded-full">
                      <p className="text-red-600 dark:text-red-400 font-semibold">
                        Please check the code and try again
                      </p>
                    </div>
                  </>
                )}

                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full font-display"
                  size="lg"
                >
                  Verify Another Code
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            💡 Tip: Partners can access this page directly at <span className="font-mono">/verify</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyRedemption;