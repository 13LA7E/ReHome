import { Camera, MapPin, Recycle, Award, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "1. Capture & Classify",
    description: "Take photos of items you want to donate",
    details: [
      "Upload multiple images at once for efficiency",
      "Our AI instantly identifies item categories",
      "Get real-time reusability assessments",
      "See estimated environmental impact per item"
    ],
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: MapPin,
    title: "2. Find Partners",
    description: "Discover verified donation centers near you",
    details: [
      "Browse recycling centers, charities, and donation hubs",
      "View exact locations on interactive map",
      "Check partner ratings and verification status",
      "Get instant directions to any location"
    ],
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Recycle,
    title: "3. Schedule Drop-off",
    description: "Arrange convenient pickup or drop-off",
    details: [
      "Choose your preferred donation center",
      "Schedule a time that works for you",
      "Get confirmation and reminders",
      "Track your donation status in real-time"
    ],
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Award,
    title: "4. Earn & Redeem",
    description: "Track impact and earn rewards",
    details: [
      "Earn 10 points per donated item",
      "Convert points to QAR (100 points = 1 QAR)",
      "Redeem for tree planting or partner discounts",
      "Monitor your environmental impact metrics"
    ],
    color: "from-orange-500 to-red-500",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background via-primary/5 to-accent/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-6 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-display font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            How ReHome Works
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light">
            A simple, transparent process from donation to impact
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative group animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-3xl blur-lg opacity-20 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative p-8 md:p-10 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm rounded-3xl border-2 border-border hover:border-primary/50 transition-all duration-300 space-y-6 h-full shadow-lg hover:shadow-hover">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground font-medium mt-1">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pl-2">
                    {step.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-start gap-3 group/item">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-300" />
                        <p className="text-muted-foreground leading-relaxed">
                          {detail}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground/80 italic">
                      {index === 0 && "💡 Pro tip: Clear photos work best for accurate classification"}
                      {index === 1 && "📍 All partners are verified and rated by our community"}
                      {index === 2 && "⏰ Most centers offer flexible scheduling options"}
                      {index === 3 && "🌟 Every donation makes a measurable environmental impact"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="inline-block p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 shadow-lg">
            <p className="text-lg md:text-xl text-foreground font-display font-semibold mb-2">
              Ready to make an impact?
            </p>
            <p className="text-muted-foreground">
              Join thousands of users who have already donated over 10,000 items
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
