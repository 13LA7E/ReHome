import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Gift, QrCode } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

const VerifyRedemption = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    rewardName: string;
    alreadyUsed: boolean;
  } | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    console.log("URL code parameter:", code);
    if (code) {
      verifyCode(code);
    } else {
      console.log("No code parameter found in URL");
    }
  }, [searchParams]);

  const verifyCode = async (verificationCode: string) => {
    setLoading(true);
    setVerificationResult(null);

    try {
      console.log("Verifying code:", verificationCode);
      console.log("Current URL:", window.location.href);
      
      // Test database connectivity first
      const { data: testConnection, error: connectionError } = await supabase
        .from("rewards")
        .select("count")
        .limit(1);
      
      console.log("Database connection test:", { testConnection, connectionError });
      
      // First try to get redemption data
      const { data: redemption, error: redemptionError } = await supabase
        .from("redemptions")
        .select("id, status, reward_id, points_spent")
        .eq("qr_code_data", verificationCode)
        .maybeSingle();

      console.log("Redemption query result:", { redemption, redemptionError });

      if (redemptionError) {
        console.error("Redemption query error:", redemptionError);
        // More specific error handling
        if (redemptionError.code === 'PGRST116') {
          toast.error("Database access denied - please check authentication");
        } else {
          toast.error(`Database error: ${redemptionError.message}`);
        }
        throw redemptionError;
      }

      if (redemption) {
        // Get reward details separately
        const { data: reward, error: rewardError } = await supabase
          .from("rewards")
          .select("name, description")
          .eq("id", redemption.reward_id)
          .single();

        console.log("Reward query result:", { reward, rewardError });

        const rewardName = reward?.name || "Reward";
        
        if (redemption.status === "completed") {
          setVerificationResult({
            valid: false,
            rewardName,
            alreadyUsed: true,
          });
          toast.error("This code has already been used!");
        } else {
          // Mark as completed
          const { error: updateError } = await supabase
            .from("redemptions")
            .update({ 
              status: "completed",
              redeemed_at: new Date().toISOString()
            })
            .eq("id", redemption.id);

          if (updateError) {
            console.error("Update error:", updateError);
            toast.error(`Failed to update redemption: ${updateError.message}`);
            return;
          }

          setVerificationResult({
            valid: true,
            rewardName,
            alreadyUsed: false,
          });
          toast.success("Redemption verified successfully!");
        }
      } else {
        console.log("No redemption found for code:", verificationCode);
        setVerificationResult({
          valid: false,
          rewardName: "",
          alreadyUsed: false,
        });
        toast.error("Invalid redemption code - no matching record found!");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationResult({
        valid: false,
        rewardName: "",
        alreadyUsed: false,
      });
      toast.error(`Verification failed: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card className="border-2 shadow-elegant">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-primary/10">
                <QrCode className="w-12 h-12 text-primary" />
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
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-lg text-muted-foreground">Verifying redemption...</p>
              </div>
            ) : verificationResult ? (
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
                    <h2 className="text-5xl font-display font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent animate-bounce">
                      ✅ VERIFIED
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
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <Gift className="w-16 h-16 text-muted-foreground mx-auto" />
                <p className="text-xl text-muted-foreground">
                  Scan a QR code to verify redemption
                </p>
                <p className="text-sm text-muted-foreground">
                  Use your phone's camera to scan the customer's QR code
                </p>
                <div className="mt-6 space-y-2">
                  <Button 
                    onClick={() => verifyCode("test-code-123")} 
                    variant="outline"
                    className="text-sm mr-2"
                  >
                    Test Verification (Debug)
                  </Button>
                  <Button 
                    onClick={async () => {
                      // Create a test redemption
                      const testCode = `test-${Date.now()}`;
                      try {
                        // Get first reward
                        const { data: rewards } = await supabase
                          .from("rewards")
                          .select("id, name")
                          .limit(1);
                        
                        if (rewards && rewards[0]) {
                          await supabase.from("redemptions").insert({
                            user_id: "00000000-0000-0000-0000-000000000000", // dummy user
                            reward_id: rewards[0].id,
                            points_spent: 100,
                            qr_code_data: testCode,
                            status: "pending"
                          });
                          
                          toast.success(`Test redemption created with code: ${testCode}`);
                          setTimeout(() => verifyCode(testCode), 1000);
                        }
                      } catch (error) {
                        console.error("Test creation error:", error);
                        toast.error("Failed to create test redemption");
                      }
                    }}
                    variant="secondary"
                    className="text-sm"
                  >
                    Create Test Redemption
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            💡 Tip: Simply scan the customer's QR code with your phone camera to instantly verify
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyRedemption;