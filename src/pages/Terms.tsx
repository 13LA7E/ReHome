import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 flex flex-col">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-4xl">
        <Card className="border-2 shadow-elegant">
          <CardHeader className="text-center border-b">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-primary/10">
                <FileText className="w-12 h-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Terms of Service
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: January 2025
            </p>
          </CardHeader>

          <CardContent className="p-6 md:p-8">
            <div className="max-h-[600px] overflow-y-auto pr-4">
              <div className="space-y-6 text-sm md:text-base">
                <section>
                  <h2 className="text-2xl font-bold mb-3">1. Agreement to Terms</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    By accessing or using ReHome ("the Service"), you agree to be bound by these Terms of Service. 
                    If you do not agree to these terms, please do not use our service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-3">2. Description of Service</h2>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    ReHome is a platform that connects users who wish to donate household items with verified 
                    donation partners. Our service includes:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Item donation tracking and classification</li>
                    <li>Reward point system for donations</li>
                    <li>Partner pickup coordination</li>
                    <li>Environmental impact tracking</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-3">3. User Accounts</h2>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    To use certain features of the Service, you must create an account. You agree to:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Provide accurate and complete information</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Notify us immediately of any unauthorized access</li>
                    <li>Take responsibility for all activities under your account</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-3">4. User Obligations</h2>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    When using our Service, you agree to:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Provide accurate information about donated items</li>
                    <li>Only donate items that are in usable condition</li>
                    <li>Not misuse the reward system or attempt to game points</li>
                    <li>Respect our donation partners and their requirements</li>
                    <li>Not upload offensive, illegal, or inappropriate content</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-3">5. Rewards Program</h2>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    Our rewards program is subject to the following terms:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Points are awarded based on donated items and their condition</li>
                    <li>Points have no cash value and cannot be transferred</li>
                    <li>Reward availability may vary and is subject to change</li>
                    <li>We reserve the right to modify or discontinue rewards at any time</li>
                    <li>Fraudulent activity will result in account termination and point forfeiture</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-3">6. Intellectual Property</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    All content, features, and functionality of the Service are owned by ReHome and are 
                    protected by copyright, trademark, and other intellectual property laws. You may not 
                    copy, modify, distribute, or reproduce any part of our Service without permission.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-3">7. User Content</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    By uploading photos or information about items, you grant ReHome a non-exclusive, 
                    worldwide license to use, display, and process this content for the purpose of 
                    operating the Service. You retain ownership of your content.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-3">8. Privacy</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Your use of the Service is also governed by our Privacy Policy. Please review our 
                    Privacy Policy to understand our data collection and usage practices.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-3">9. Disclaimer of Warranties</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    The Service is provided "as is" without warranties of any kind, either express or 
                    implied. We do not guarantee that the Service will be error-free, secure, or 
                    uninterrupted. Use of the Service is at your own risk.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-3">10. Limitation of Liability</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    ReHome and its affiliates shall not be liable for any indirect, incidental, special, 
                    consequential, or punitive damages arising from your use of the Service. Our total 
                    liability shall not exceed the amount you paid to use the Service in the past 12 months.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-3">11. Third-Party Partners</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We work with verified donation partners to facilitate item pickup and distribution. 
                    We are not responsible for the actions, policies, or services of our partners. Any 
                    disputes with partners should be resolved directly with them.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-3">12. Termination</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We reserve the right to suspend or terminate your account at any time for violations 
                    of these Terms, fraudulent activity, or other reasons we deem appropriate. You may 
                    also close your account at any time through your account settings.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-3">13. Changes to Terms</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We may update these Terms from time to time. We will notify users of significant 
                    changes via email or through the Service. Continued use of the Service after changes 
                    constitutes acceptance of the new Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-3">14. Governing Law</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    These Terms shall be governed by and construed in accordance with the laws of the 
                    jurisdiction in which ReHome operates, without regard to conflict of law principles.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-3">15. Contact Information</h2>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    If you have questions about these Terms, please contact us at:
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-semibold">ReHome Support</p>
                    <p className="text-muted-foreground">Email: support@ReHome.com</p>
                  </div>
                </section>

                <section className="border-t pt-6 mt-8">
                  <p className="text-xs text-muted-foreground text-center">
                    By using ReHome, you acknowledge that you have read, understood, and agree to be 
                    bound by these Terms of Service.
                  </p>
                </section>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
