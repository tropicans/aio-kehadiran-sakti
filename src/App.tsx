import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DailyActivityInputPage from "./pages/DailyActivityInputPage";
import LoginPage from "./pages/LoginPage"; // Import LoginPage yang baru
import ProtectedRoute from "./components/Auth/ProtectedRoute"; // Import ProtectedRoute yang baru
import UserManagementPage from "./pages/UserManagementPage"; // Import UserManagementPage yang baru

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter> {/* HANYA ADA SATU BROWSERROUTER */}
        <Routes> {/* HANYA ADA SATU ROUTES */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} /> {/* Rute untuk halaman login */}
          <Route
            path="/admin/activities"
            element={
              <ProtectedRoute>
                <DailyActivityInputPage />
              </ProtectedRoute>
            }
          /> {/* Halaman admin yang dilindungi */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <UserManagementPage />
              </ProtectedRoute>
            }
          /> {/* Halaman manajemen pengguna yang dilindungi */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
