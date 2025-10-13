import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 flex flex-col">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-4xl">
        <Card className="border-2 shadow-elegant">
          <CardHeader className="text-center border-b">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-primary/10">
                <Shield className="w-12 h-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Privacy Policy
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: January 2025
            </p>
          </CardHeader>

          <CardContent className="p-6 md:p-8">
            <div className="max-h-[600px] overflow-y-auto pr-4">
              <div className="space-y-6 text-sm md:text-base">
                <section>
                  <h2 className="text-2xl font-bold mb-3">1. Introduction</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    ReHome ("we," "our," or "us") is committed to protecting your privacy. This Privacy 
                    Policy explains how we collect, use, disclose, and safeguard your information when you 
                    use our service. Please read this policy carefully.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-3">2. Information We Collect</h2>
                  
                  <h3 className="text-xl font-semibold mt-4 mb-2">2.1 Information You Provide</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    We collect information that you voluntarily provide to us:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Account information (name, email address, password)</li>
                    <li>Profile information and preferences</li>
                    <li>Photos and descriptions of donated items</li>
                    <li>Location data when scheduling pickups</li>
                    <li>Communications with us and feedback</li>
                  </ul>

                  <h3 className="text-xl font-semibold mt-4 mb-2">2.2 Automatically Collected Information</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    When you use our service, we automatically collect:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Device information (browser type, operating system, device identifiers)</li>
                    <li>Usage data (pages visited, features used, time spent)</li>
                    <li>IP address and general location information</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>

                  <h3 className="text-xl font-semibold mt-4 mb-2">2.3 AI Processing</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We use AI technology (Google Gemini API) to classify uploaded item images. These images 
                    are processed to identify item types and conditions but are not used to train AI models.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-3">3. How We Use Your Information</h2>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    We use the collected information for the following purposes:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>To provide and maintain our service</li>
                    <li>To process donations and coordinate pickups</li>
                    <li>To calculate and award reward points</li>
                    <li>To send notifications about your donations and rewards</li>
                    <li>To improve our service and user experience</li>
                    <li>To communicate with you about updates and promotions</li>
                    <li>To prevent fraud and ensure security</li>
                    <li>To comply with legal obligations</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-3">4. Information Sharing and Disclosure</h2>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    We may share your information in the following situations:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li><strong>With Donation Partners:</strong> We share necessary information (contact details, pickup location, item details) with verified partners to facilitate donations</li>
                    <li><strong>Service Providers:</strong> We use third-party services (Supabase for data storage, Google Gemini for AI, Resend for emails) that may process your data</li>
                    <li><strong>Legal Requirements:</strong> We may disclose information if required by law, court order, or government request</li>
                    <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale, your information may be transferred</li>
                    <li><strong>With Your Consent:</strong> We may share information with your explicit permission</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-3">5. Data Security</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We implement appropriate technical and organizational measures to protect your personal 
                    information, including encryption, access controls, and secure storage. However, no 
                    method of transmission over the internet is 100% secure, and we cannot guarantee 
                    absolute security.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-3">6. Data Retention</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We retain your personal information for as long as necessary to provide our services, 
                    comply with legal obligations, resolve disputes, and enforce our agreements. You can 
                    request deletion of your account and data at any time.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-3">7. Your Privacy Rights</h2>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    Depending on your location, you may have the following rights:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li><strong>Access:</strong> Request access to your personal data</li>
                    <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                    <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                    <li><strong>Objection:</strong> Object to certain processing of your data</li>
                    <li><strong>Restriction:</strong> Request restriction of data processing</li>
                    <li><strong>Withdraw Consent:</strong> Withdraw previously given consent</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-3">
                    To exercise these rights, please contact us at support@ReHome.com
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-3">8. Cookies and Tracking Technologies</h2>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    We use cookies and similar technologies to:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Maintain your session and authentication</li>
                    <li>Remember your preferences</li>
                    <li>Analyze usage patterns</li>
                    <li>Improve service performance</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-3">
                    You can control cookies through your browser settings, but disabling them may affect 
                    functionality.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-3">9. Third-Party Services</h2>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    Our service uses the following third-party providers:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li><strong>Supabase:</strong> Database, authentication, and storage services</li>
                    <li><strong>Google Gemini API:</strong> AI image classification</li>
                    <li><strong>Resend:</strong> Email delivery service</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-3">
                    These providers have their own privacy policies governing their collection and use of 
                    your information.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-3">10. Children's Privacy</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Our service is not intended for children under 13 years of age. We do not knowingly 
                    collect personal information from children. If we learn we have collected information 
                    from a child under 13, we will delete it promptly.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-3">11. International Data Transfers</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Your information may be transferred to and processed in countries other than your own. 
                    We ensure appropriate safeguards are in place to protect your data in accordance with 
                    this Privacy Policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-3">12. Changes to This Policy</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We may update this Privacy Policy from time to time. We will notify you of significant 
                    changes by posting the new policy and updating the "Last updated" date. Your continued 
                    use of the service after changes constitutes acceptance.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-3">13. Contact Us</h2>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    If you have questions or concerns about this Privacy Policy, please contact us:
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-semibold">ReHome Privacy Team</p>
                    <p className="text-muted-foreground">Email: support@ReHome.com</p>
                  </div>
                </section>

                <section className="border-t pt-6 mt-8">
                  <p className="text-xs text-muted-foreground text-center">
                    By using ReHome, you acknowledge that you have read and understood this Privacy Policy 
                    and agree to our collection, use, and disclosure of your information as described.
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

export default Privacy;
