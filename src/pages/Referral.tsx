import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Copy, Share2, Users, Gift, TrendingUp, Check } from "lucide-react";
import { toast } from "sonner";

export default function Referral() {
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState("");
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    completedReferrals: 0,
    pendingReferrals: 0,
    totalRewards: 0,
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      fetchReferralData();
    }
  }, [user]);

  const fetchReferralData = async () => {
    if (!user) return;

    try {
      // Note: Will work after running migration
      const { data: referralData } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_id", user.id)
        .single();

      if (referralData) {
        setReferralCode(referralData.referral_code);
      }

      // Fetch stats
      const { data: allReferrals } = await supabase
        .from("referrals")
        .select("status, reward_points")
        .eq("referrer_id", user.id);

      if (allReferrals) {
        const stats = allReferrals.reduce(
          (acc, ref) => {
            acc.totalReferrals++;
            if (ref.status === "completed") acc.completedReferrals++;
            if (ref.status === "pending") acc.pendingReferrals++;
            if (ref.status === "rewarded") acc.totalRewards += ref.reward_points || 0;
            return acc;
          },
          { totalReferrals: 0, completedReferrals: 0, pendingReferrals: 0, totalRewards: 0 }
        );
        setReferralStats(stats);
      }
    } catch (error) {
      console.error("Error fetching referral data:", error);
      // Fallback: generate a code based on user ID
      setReferralCode(`REF${user.id.substring(0, 8).toUpperCase()}`);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/ReHome/#/auth?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Referral link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferral = async () => {
    const link = `${window.location.origin}/ReHome/#/auth?ref=${referralCode}`;
    const text = `Join me on ReHome and earn rewards for your donations! Use my referral code: ${referralCode}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Join ReHome", text, url: link });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      copyReferralLink();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="h-12 bg-muted animate-pulse rounded w-64" />
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="h-20 bg-muted animate-pulse rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <div className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Refer & Earn
              </h1>
              <p className="text-xl text-muted-foreground">
                Share ReHome with friends and earn rewards together!
              </p>
            </div>

            {/* Referral Code Card */}
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                    <Gift className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">Your Referral Code</span>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <div className="text-5xl font-bold font-mono text-primary">
                      {referralCode}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={copyReferralLink} size="lg" className="gap-2">
                      {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                      {copied ? "Copied!" : "Copy Link"}
                    </Button>
                    <Button onClick={shareReferral} variant="outline" size="lg" className="gap-2">
                      <Share2 className="h-5 w-5" />
                      Share
                    </Button>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Share this code with friends. When they sign up and make their first donation,
                    you both earn <span className="font-bold text-primary">100 bonus points!</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{referralStats.totalReferrals}</p>
                      <p className="text-sm text-muted-foreground">Total Referrals</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                      <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{referralStats.completedReferrals}</p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{referralStats.pendingReferrals}</p>
                      <p className="text-sm text-muted-foreground">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <Gift className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{referralStats.totalRewards}</p>
                      <p className="text-sm text-muted-foreground">Points Earned</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* How It Works */}
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">How It Works</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Share Your Code</h4>
                      <p className="text-muted-foreground">
                        Send your unique referral code to friends via social media, email, or text.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Friend Signs Up</h4>
                      <p className="text-muted-foreground">
                        Your friend creates an account using your referral code.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">First Donation</h4>
                      <p className="text-muted-foreground">
                        When they make their first donation, the referral is completed.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Earn Rewards</h4>
                      <p className="text-muted-foreground">
                        You both receive 100 bonus points! No limit on referrals.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
