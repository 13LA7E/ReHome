import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Globe, Target, Leaf, Sparkles } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 flex flex-col">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex justify-center mb-6">
            <div className="p-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
              <Leaf className="w-16 h-16 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            About ReHome
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transforming household clutter into community impact, one donation at a time
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="border-2 shadow-elegant mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              ReHome is on a mission to make sustainable living effortless and rewarding. We believe 
              that every household item deserves a second chance, and every act of giving should be 
              recognized and celebrated.
            </p>
            <p>
              By connecting generous donors with verified organizations, we're building a circular 
              economy where nothing goes to waste and everyone benefits – from individuals decluttering 
              their homes to communities receiving essential items.
            </p>
          </CardContent>
        </Card>

        {/* Core Values */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 hover:shadow-elegant transition-shadow">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-green-500/10">
                  <Globe className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold">Sustainability</h3>
              <p className="text-sm text-muted-foreground">
                Reducing waste and promoting circular economy principles through responsible rehoming
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-elegant transition-shadow">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-blue-500/10">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold">Community</h3>
              <p className="text-sm text-muted-foreground">
                Building connections between donors and organizations to strengthen local communities
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-elegant transition-shadow">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-purple-500/10">
                  <Heart className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold">Impact</h3>
              <p className="text-sm text-muted-foreground">
                Creating measurable positive change for people and planet through every donation
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="border-2 shadow-elegant mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              How ReHome Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold mb-2">Upload & Classify</h4>
                <p className="text-sm text-muted-foreground">
                  Take a photo of your item. Our AI instantly identifies and classifies it, making 
                  the process quick and easy.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold mb-2">Earn Points</h4>
                <p className="text-sm text-muted-foreground">
                  Every donation earns you reward points based on the item type and condition. Track 
                  your impact in real-time.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold mb-2">Connect with Partners</h4>
                <p className="text-sm text-muted-foreground">
                  Match with verified organizations near you. Schedule convenient pickups directly 
                  through the app.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold mb-2">Redeem Rewards</h4>
                <p className="text-sm text-muted-foreground">
                  Use your points to unlock exclusive rewards and discounts from our partner businesses.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Our Story */}
        <Card className="border-2 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-2xl">Our Story</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              ReHome was born from a simple observation: people want to donate their unused items, 
              but the process is often too complicated. We saw perfectly good furniture sitting by the 
              curb, clothes piling up in closets, and electronics gathering dust – all because donating 
              felt like too much work.
            </p>
            <p>
              We imagined a world where giving is as easy as taking a photo. Where every donation is 
              recognized, tracked, and rewarded. Where the environmental impact of reusing items is 
              visible and celebrated.
            </p>
            <p>
              Today, ReHome is making that vision a reality. We're building a community of conscious 
              consumers who understand that their unwanted items are someone else's treasures. Together, 
              we're creating a more sustainable, connected, and generous world.
            </p>
          </CardContent>
        </Card>

        {/* Join Us CTA */}
        <div className="text-center mt-12 p-8 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border-2">
          <h2 className="text-2xl font-bold mb-3">Join Our Movement</h2>
          <p className="text-muted-foreground mb-6">
            Be part of a community that's reshaping how we think about giving and sustainability
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
