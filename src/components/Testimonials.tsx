import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";
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

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      // Note: Will work after running migration
      const { data } = await supabase
        .from("testimonials")
        .select("*")
        .eq("approved", true)
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(6);

      if (data) {
        setTestimonials(data as any);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      // Fallback demo data
      setTestimonials([
        {
          id: "1",
          user_name: "Sarah Johnson",
          user_avatar: null,
          rating: 5,
          content: "ReHome made donating so easy! I love seeing the real impact of my contributions. The rewards are a great bonus too!",
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          user_name: "Ahmed Al-Rashid",
          user_avatar: null,
          rating: 5,
          content: "Amazing platform! I've donated over 50 items and it feels great knowing they're going to people who need them.",
          created_at: new Date().toISOString(),
        },
        {
          id: "3",
          user_name: "Maria Garcia",
          user_avatar: null,
          rating: 5,
          content: "The AI classification is incredibly accurate. Makes the whole donation process smooth and effortless!",
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-10 bg-muted animate-pulse rounded w-64 mx-auto mb-4" />
            <div className="h-6 bg-muted animate-pulse rounded w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border-2">
                <CardContent className="p-6">
                  <div className="h-40 bg-muted animate-pulse rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            What Our Community Says
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real stories from people making a difference
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="border-2 border-primary/20 hover:border-primary transition-colors hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/20" />
                  
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {renderStars(testimonial.rating)}
                  </div>

                  {/* Content */}
                  <p className="text-muted-foreground mb-6 relative z-10">
                    "{testimonial.content}"
                  </p>

                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarImage src={testimonial.user_avatar || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white font-semibold">
                        {testimonial.user_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.user_name}</p>
                      <p className="text-sm text-muted-foreground">
                        ReHome Community Member
                      </p>
                    </div>
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
