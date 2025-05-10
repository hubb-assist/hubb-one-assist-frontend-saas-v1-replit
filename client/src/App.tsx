import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Setup from "@/pages/setup";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import AdminDashboard from "@/pages/admin/dashboard";
import Segments from "@/pages/admin/segments";
import Modules from "@/pages/admin/modules";
import PrivateRoute from "@/components/auth/private-route";
import { useAuth } from "@/lib/auth";

function Router() {
  const { checkAuth } = useAuth();

  // Verificar a autenticação ao carregar a aplicação
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/setup" component={Setup}/>
      <Route path="/login" component={Login}/>
      
      {/* Rotas protegidas */}
      <Route path="/dashboard">
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      </Route>
      
      <Route path="/admin/dashboard">
        <PrivateRoute>
          <AdminDashboard />
        </PrivateRoute>
      </Route>
      
      <Route path="/admin/segments">
        <PrivateRoute>
          <Segments />
        </PrivateRoute>
      </Route>
      
      <Route path="/admin/modules">
        <PrivateRoute>
          <Modules />
        </PrivateRoute>
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <SonnerToaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
