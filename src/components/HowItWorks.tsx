import { Camera, Search, Handshake, Award } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Camera,
    title: "Snap a Photo",
    description: "Open ReHome and photograph any household item. The whole analysis runs directly in your browser — nothing is ever uploaded.",
    iconBg: "from-emerald-400 to-primary",
  },
  {
    number: "02",
    icon: Search,
    title: "AI Classifies It",
    description: "Our on-device COCO-SSD model instantly identifies what it is, how it's categorised, and suggests the best reuse path.",
    iconBg: "from-sky-400 to-blue-500",
  },
  {
    number: "03",
    icon: Handshake,
    title: "Match with a Partner",
    description: "We surface verified local charities, donation hubs, and recycling centres within a few clicks of your current location.",
    iconBg: "from-amber-400 to-orange-400",
  },
  {
    number: "04",
    icon: Award,
    title: "Earn Your Reward",
    description: "Complete a donation to earn 5–45 points. Build streaks, hit milestones, and watch your personal impact score grow.",
    iconBg: "from-violet-400 to-purple-500",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">

      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="blob-float absolute top-10 right-[-120px] w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(39 95% 60% / 0.14) 0%, transparent 70%)" }}
        />
        <div
          className="blob-float-slow absolute bottom-0 left-[-80px] w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(158 84% 50% / 0.12) 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4">

        {/* Section header */}
        <div className="text-center mb-14 md:mb-18 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass text-primary text-sm font-semibold fade-in-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Simple 4-Step Process
          </div>
          <h2 className="fade-in-up delay-100 text-3xl md:text-5xl font-display font-bold text-foreground tracking-tight">
            How{" "}
            <span className="bg-gradient-to-r from-primary via-emerald-400 to-amber-400 bg-clip-text text-transparent">
              ReHome
            </span>{" "}
            Works
          </h2>
          <p className="fade-in-up delay-200 text-lg text-muted-foreground max-w-xl mx-auto">
            From photo to donation in under two minutes — privacy first, always.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className={"glass-card gradient-border-animated rounded-2xl p-6 md:p-7 flex flex-col gap-4 group scale-in delay-" + ((i + 1) * 100)}
              >
                {/* Numbered badge + icon row */}
                <div className="flex items-center gap-3">
                  <div className={"spin-in w-10 h-10 rounded-xl bg-gradient-to-br " + step.iconBg + " flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300"}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="glow-ring font-display text-2xl font-extrabold bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-foreground text-base leading-snug">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
