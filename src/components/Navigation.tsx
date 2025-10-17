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
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="glass-nav rounded-full px-4 md:px-6 py-2.5 md:py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <div className="bg-primary/10 p-1.5 rounded-full">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg md:text-xl font-display font-bold text-primary hidden sm:block">
              ReHome
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link to="/multi-upload">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full" size="sm">
                    Donate
                  </Button>
                </Link>
                <Link to="/impact">
                  <Button variant="ghost" size="sm" className="rounded-full">
                    Impact
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={avatarUrl || undefined} alt={username || "User"} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 glass-card border-0">
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
                    <DropdownMenuItem onClick={() => navigate('/redeem')} className="cursor-pointer">
                      Redeem Points
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                      <SettingsIcon className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/about">
                  <Button variant="ghost" size="sm" className="rounded-full">
                    About
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px] glass-card border-0">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-primary" />
                    <span className="text-primary">Menu</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-3 mt-8">
                  {user ? (
                    <>
                      <Button 
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 justify-start" 
                        onClick={() => handleNavigation("/multi-upload")}
                      >
                        Donate Items
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={() => handleNavigation("/impact")}
                      >
                        My Impact
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={() => handleNavigation("/redeem")}
                      >
                        Redeem Points
                      </Button>
                      <div className="border-t my-2" />
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={() => handleNavigation("/settings")}
                      >
                        <SettingsIcon className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-destructive hover:text-destructive"
                        onClick={handleSignOut}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
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
                      <div className="border-t my-2" />
                      <Button 
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => handleNavigation("/auth")}
                      >
                        Get Started
                      </Button>
                    </>
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