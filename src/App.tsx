import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navigation } from "@/components/Navigation";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Upload from "./pages/Upload";
import MultiUpload from "./pages/MultiUpload";
import Partners from "./pages/Partners";
import Impact from "./pages/Impact";
import Redeem from "./pages/Redeem";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/auth" 
              element={
                <>
                  <Navigation />
                  <Auth />
                </>
              } 
            />
            <Route 
              path="/upload" 
              element={
                <ProtectedRoute>
                  <Navigation />
                  <Upload />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/multi-upload" 
              element={
                <ProtectedRoute>
                  <Navigation />
                  <MultiUpload />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/partners" 
              element={
                <ProtectedRoute>
                  <Navigation />
                  <Partners />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/redeem" 
              element={
                <ProtectedRoute>
                  <Navigation />
                  <Redeem />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/impact" 
              element={
                <ProtectedRoute>
                  <Navigation />
                  <Impact />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
