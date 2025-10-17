import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Leaf, LogOut, User, Menu, Settings as SettingsIcon } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", user.id)
          .single();

        if (!error && data) {
          if ('username' in data && data.username && typeof data.username === 'string') {
            setUsername(data.username as string);
          }
          if ('avatar_url' in data && data.avatar_url && typeof data.avatar_url === 'string') {
            setAvatarUrl(data.avatar_url as string);
          }
        }
      } catch (error) {
        // Silently fail if columns don't exist yet
        console.log("Profile fields not available yet");
      }
    };

    fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    setIsOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 glass-nav">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover-scale">
            <div className="bg-primary/10 p-1.5 md:p-2 rounded-full">
              <Leaf className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <span className="text-xl md:text-2xl font-display font-bold text-primary">
              ReHome
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <Link to="/about">
              <Button variant="ghost" size="sm">
                About
              </Button>
            </Link>
            <Link to="/faq">
              <Button variant="ghost" size="sm">
                FAQ
              </Button>
            </Link>
            <Link to="/blog">
              <Button variant="ghost" size="sm">
                News
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="ghost" size="sm">
                Contact
              </Button>
            </Link>
            {user ? (
              <>
                <Link to="/redeem">
                  <Button variant="ghost" size="sm">
                    Redeem
                  </Button>
                </Link>
                <Link to="/impact">
                  <Button variant="ghost" size="sm">
                    My Impact
                  </Button>
                </Link>
                <Link to="/multi-upload">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md" size="sm">
                    Donate Items
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full p-0">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={avatarUrl || undefined} alt={username || "User"} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur">
                    <div className="flex items-center gap-3 px-2 py-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={avatarUrl || undefined} alt={username || "User"} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        {username && (
                          <p className="text-sm font-medium">@{username}</p>
                        )}
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                      <SettingsIcon className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/referral')} className="cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      Referrals
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/auth">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md" size="sm">
                  Get Started
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-primary" />
                    <span className="text-primary">
                      ReHome Menu
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2">
                      General
                    </p>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => handleNavigation("/about")}
                    >
                      About
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => handleNavigation("/faq")}
                    >
                      FAQ
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => handleNavigation("/contact")}
                    >
                      Contact
                    </Button>
                  </div>
                  {user ? (
                    <>
                      <div className="border-t pt-4 space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2">
                          Your Account
                        </p>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start"
                          onClick={() => handleNavigation("/redeem")}
                        >
                          Redeem
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start"
                          onClick={() => handleNavigation("/impact")}
                        >
                          My Impact
                        </Button>
                        <Button 
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md justify-start" 
                          onClick={() => handleNavigation("/multi-upload")}
                        >
                          Donate Items
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start"
                          onClick={() => handleNavigation("/settings")}
                        >
                          <SettingsIcon className="h-4 w-4 mr-2" />
                          Settings
                        </Button>
                      </div>
                      <div className="border-t pt-4 mt-4">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-destructive hover:text-destructive"
                          onClick={handleSignOut}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="border-t pt-4">
                      <Button 
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                        onClick={() => handleNavigation("/auth")}
                      >
                        Get Started
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};