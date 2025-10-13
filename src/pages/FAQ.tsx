import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "How does ReHome work?",
      answer: "ReHome makes donating simple: 1) Take a photo of your item, 2) Our AI classifies it automatically, 3) Earn reward points, 4) Connect with verified donation partners, and 5) Schedule a convenient pickup. It's that easy!"
    },
    {
      question: "What items can I donate?",
      answer: "You can donate a wide variety of household items including furniture, electronics, clothing, books, kitchenware, toys, and more. Our AI helps identify and classify items to match you with the right organizations. Items should be in usable condition."
    },
    {
      question: "How do I earn points?",
      answer: "You earn points automatically when you upload and donate items. Points are awarded based on item type, condition, and environmental impact. Track your points in your profile and use them to redeem rewards from partner businesses."
    },
    {
      question: "Are the donation partners verified?",
      answer: "Yes! All organizations on our platform are thoroughly vetted and verified. We partner with registered charities, NGOs, recycling centers, and community organizations that meet our standards for transparency and impact."
    },
    {
      question: "Is there a pickup service?",
      answer: "Many of our partner organizations offer pickup services. When you connect with a partner, you can schedule a pickup directly through the app. Some partners may have minimum item requirements or serve specific areas."
    },
    {
      question: "How are items classified?",
      answer: "We use Google Gemini AI technology to automatically identify and classify your items from photos. The AI analyzes the image to determine item type, category, and approximate condition, making the donation process quick and accurate."
    },
    {
      question: "Can I donate multiple items at once?",
      answer: "Absolutely! Use our Multi-Upload feature to photograph and donate several items in one session. This is perfect for decluttering entire rooms or preparing for a move."
    },
    {
      question: "What rewards can I redeem?",
      answer: "Rewards vary and include discounts from partner retailers, vouchers, exclusive offers, and special perks. New rewards are added regularly. Check the Rewards page to see current offerings and point requirements."
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we take privacy seriously. We use enterprise-grade encryption and security measures to protect your data. We never sell personal information. Read our Privacy Policy for complete details on data handling."
    },
    {
      question: "Can I track my environmental impact?",
      answer: "Yes! Your Impact page shows detailed statistics including items donated, CO₂ emissions saved, waste diverted from landfills, and more. Watch your positive environmental impact grow with every donation."
    },
    {
      question: "Do I need to create an account?",
      answer: "Yes, an account is required to use ReHome. This allows us to track your donations, award points, save your preferences, and provide personalized partner recommendations. Sign up is quick and free!"
    },
    {
      question: "What if an organization doesn't pick up my item?",
      answer: "If you experience issues with a scheduled pickup, please contact us immediately through our support email. We'll work with you and the partner organization to resolve the situation or find an alternative solution."
    },
    {
      question: "Can organizations join as partners?",
      answer: "Yes! We're always looking for verified organizations to join our network. If you represent a charity, NGO, or recycling center, please contact us at support@ReHome.com to learn about our partnership program."
    },
    {
      question: "Is ReHome free to use?",
      answer: "Yes, ReHome is completely free for donors. There are no fees to upload items, connect with partners, or redeem rewards. Our mission is to make sustainable donation as accessible as possible."
    },
    {
      question: "What happens to my uploaded photos?",
      answer: "Photos are used solely to classify items and facilitate donations. They're processed by our AI, stored securely in your account, and may be shared with partner organizations to help coordinate pickups. You can delete photos anytime."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 flex flex-col">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-4xl">
        <Card className="border-2 shadow-elegant">
          <CardHeader className="text-center border-b">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-primary/10">
                <HelpCircle className="w-12 h-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Frequently Asked Questions
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Find answers to common questions about ReHome
            </p>
          </CardHeader>

          <CardContent className="p-6 md:p-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-semibold hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-8 p-6 rounded-lg bg-muted/50 text-center">
              <h3 className="font-semibold text-lg mb-2">Still have questions?</h3>
              <p className="text-sm text-muted-foreground">
                Can't find what you're looking for? Contact our support team at{" "}
                <a href="mailto:support@ReHome.com" className="text-primary hover:underline font-medium">
                  support@ReHome.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
