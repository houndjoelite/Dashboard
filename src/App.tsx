
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NosActions from "./pages/NosActions";
import Alertes from "./pages/Alertes";
import LancerAlerte from "./pages/LancerAlerte";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import { Dashboard } from "./pages/admin/Dashboard";
import AdminLayout from "./components/admin/AdminLayout";
import TestUpload from "./pages/TestUpload";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/alertes" element={<Alertes />} />
          <Route path="/nos-actions" element={<NosActions />} />
          <Route path="/lancer-alerte" element={<LancerAlerte />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/test-upload" element={<TestUpload />} />
          {/* Routes d'administration */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="alerts" element={<Dashboard defaultTab="alerts" />} />
          </Route>
          
          {/* Redirection pour les anciens liens */}
          <Route path="/admin#alerts" element={<Dashboard defaultTab="alerts" />} />
          <Route path="/admin#actions" element={<Dashboard defaultTab="actions" />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
