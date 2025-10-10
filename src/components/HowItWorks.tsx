import { Upload, Sparkles, MapPin, Calendar } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Item",
    description: "Take a photo of clothes, books, furniture, or electronics you want to donate",
    color: "from-primary to-primary-glow"
  },
  {
    icon: Sparkles,
    title: "AI Classification",
    description: "Our AI instantly identifies and categorizes your item for optimal matching",
    color: "from-accent to-primary"
  },
  {
    icon: MapPin,
    title: "Find Partners",
    description: "Get matched with nearby NGOs, schools, recyclers, or individuals in need",
    color: "from-primary-glow to-accent"
  },
  {
    icon: Calendar,
    title: "Schedule Pickup",
    description: "Arrange convenient pickup by volunteers or drop off yourself",
    color: "from-accent to-primary"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            How ReHome Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to transform your unused items into community impact
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative group animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-2 border border-border h-full">
                {/* Step number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center shadow-soft font-bold text-primary-foreground text-lg">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-soft group-hover:shadow-glow transition-all duration-300 group-hover:scale-110`}>
                  <step.icon className="w-8 h-8 text-primary-foreground" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-accent"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
