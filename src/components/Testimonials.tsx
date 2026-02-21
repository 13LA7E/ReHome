import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  user_name: string;
  user_avatar: string | null;
  rating: number;
  content: string;
  created_at: string;
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = async () => {
    try {
      const { data } = await supabase
        .from("testimonials").select("*")
        .eq("approved", true).eq("featured", true)
        .order("created_at", { ascending: false }).limit(6);
      if (data) setTestimonials(data as Testimonial[]);
    } catch { /* table may not exist yet */ } finally { setLoading(false); }
  };

  const renderStars = (rating: number) =>
    [...Array(5)].map((_, i) => (
      <Star key={i} className={"h-4 w-4 " + (i < rating ? "fill-amber-400 text-amber-400" : "text-border")} />
    ));

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-muted animate-pulse rounded-full w-56 mx-auto mb-4" />
            <div className="h-5 bg-muted animate-pulse rounded-full w-80 mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[...Array(3)].map((_, i) => (<div key={i} className="h-44 bg-muted animate-pulse rounded-2xl" />))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mx-auto">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
              Be Among the First
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              ReHome is in early access. Join now, start donating, and your story could be
              the first one featured right here.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button size="lg" onClick={() => navigate("/auth")}
                className="rounded-full px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                Join Early Access <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/about")}
                className="rounded-full px-8 py-6 text-base border-2 hover:bg-muted/50 transition-all duration-300">
                Learn More
              </Button>
            </div>
            {/* Ghost placeholders */}
            <div className="grid sm:grid-cols-3 gap-4 pt-8 opacity-40 pointer-events-none select-none">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-border/60 p-5 space-y-3 text-left">
                  <div className="flex gap-1">{[...Array(5)].map((__, s) => (<Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />))}</div>
                  <div className="space-y-1.5">
                    <div className="h-3 bg-muted rounded-full w-full" />
                    <div className="h-3 bg-muted rounded-full w-4/5" />
                    <div className="h-3 bg-muted rounded-full w-3/5" />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <div className="w-7 h-7 rounded-full bg-muted" />
                    <div className="h-3 bg-muted rounded-full w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-28 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-3">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full">
            Community
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground">
            What Our Community Says
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">Real stories from people making a real difference</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {testimonials.map((t) => (
            <Card key={t.id} className="border border-border/60 hover:border-primary/30 hover:shadow-lg transition-all duration-300 rounded-2xl">
              <CardContent className="p-6">
                <Quote className="w-7 h-7 text-primary/20 mb-3" />
                <div className="flex gap-0.5 mb-3">{renderStars(t.rating)}</div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{t.content}</p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src={t.user_avatar || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {t.user_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.user_name}</p>
                    <p className="text-xs text-muted-foreground">ReHome community member</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
