import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navigation } from "@/components/Navigation";
import { CookieConsent } from "@/components/CookieConsent";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PageTransition } from "@/components/PageTransition";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Upload from "./pages/Upload";
import MultiUpload from "./pages/MultiUpload";
import Partners from "./pages/Partners";
import ImpactNew from "./pages/ImpactNew";
import Redeem from "./pages/Redeem";
import VerifyRedemption from "./pages/VerifyRedemption";
import Settings from "./pages/Settings";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Referral from "./pages/Referral";
import Admin from "./pages/Admin";
import PartnerDashboard from "./pages/PartnerDashboard";
import SentryTest from "./pages/SentryTest";

const queryClient = new QueryClient();

const App = () => (
  <Sentry.ErrorBoundary fallback={<ErrorBoundary />} showDialog>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="light">
          <Toaster />
          <Sonner />
          <HashRouter>
            <AuthProvider>
              <Navigation />
              <PageTransition>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
                  <Route path="/multi-upload" element={<ProtectedRoute><MultiUpload /></ProtectedRoute>} />
                  <Route path="/partners" element={<ProtectedRoute><Partners /></ProtectedRoute>} />
                  <Route path="/redeem" element={<ProtectedRoute><Redeem /></ProtectedRoute>} />
                  <Route path="/verify" element={<VerifyRedemption />} />
                  <Route path="/impact" element={<ProtectedRoute><ImpactNew /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/referral" element={<ProtectedRoute><Referral /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                  <Route path="/partner-dashboard" element={<ProtectedRoute><PartnerDashboard /></ProtectedRoute>} />
                  <Route path="/sentry-test" element={<SentryTest />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </PageTransition>
              <CookieConsent />
            </AuthProvider>
          </HashRouter>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </Sentry.ErrorBoundary>
);

export default App;
