import { Toaster }                    from "@/components/ui/toaster";
import { Toaster as Sonner }          from "@/components/ui/sonner";
import { TooltipProvider }            from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider }               from "@/lib/auth-context";
import { ThemeProvider }              from "@/lib/theme-context";
import Index                          from "./pages/Index";
import OrgChart                       from "./pages/OrgChart";
import Login                          from "./pages/Login";
import Dashboard                      from "./pages/Dashboard";
import CalendarView                   from "./pages/CalendarView";
import NotFound                       from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:          60 * 1000,   // data fresh for 60s — avoids unnecessary refetches
      gcTime:         5 * 60 * 1000,   // keep unused cache for 5 min
      retry:          1,               // retry once on failure, not 3 times
      refetchOnWindowFocus: false,     // don't refetch just because user switched tabs
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/"          element={<Index />} />
              <Route path="/calendar"  element={<CalendarView />} />
              <Route path="/org-chart" element={<OrgChart />} />
              <Route path="/login"     element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*"          element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
