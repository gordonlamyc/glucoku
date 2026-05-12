import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Scanner from "./pages/Scanner";
import GlucoseLog from "./pages/GlucoseLog";
import Chatbot from "./pages/Chatbot";
import Advice from "./pages/Advice";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import VerifyDevice from "./pages/VerifyDevice";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/log" element={<GlucoseLog />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/advice" element={<Advice />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/verify-device" element={<VerifyDevice />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
