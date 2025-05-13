import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Setup from "@/pages/setup";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminHome from "@/pages/admin/index";
import ClinicaDashboard from "@/pages/clinica/index";
import UserDashboard from "@/pages/app/index";
import Segments from "@/pages/admin/segments";
import Modules from "@/pages/admin/modules";
import Plans from "@/pages/admin/plans";
import SystemUsers from "@/pages/admin/system-users";
import Subscribers from "@/pages/admin/subscribers";
import Onboarding from "@/pages/public/onboarding";
import PrivateRoute from "@/components/auth/private-route";
import { useAuth } from "@/lib/auth";
import { getDashboardPathByRole } from "@/components/layout/dynamic-app-shell";

function Router() {
  const { checkAuth, isAuthenticated, isLoading, user } = useAuth();

  // Flag para evitar login automático inesperado
  const [didPerformInitialCheck, setDidPerformInitialCheck] = useState(false);
  
  // Validar autenticação mais rigorosamente (proteção extra)
  const isReallyAuthenticated = 
    isAuthenticated && 
    user && 
    user.id && 
    user.email && 
    (user.authenticated !== false);
    
  // Verificar a autenticação ao carregar a aplicação
  useEffect(() => {
    // Lista de rotas públicas que não exigem verificação de autenticação
    const publicRoutes = ['/login', '/onboarding', '/'];
    const currentPath = window.location.pathname;
    const isPublicRoute = publicRoutes.some(route => 
      currentPath === route || currentPath.startsWith(route + '/')
    );
    
    // Não verificar autenticação para rotas públicas
    if (isPublicRoute) {
      setDidPerformInitialCheck(true);
      return;
    }
    
    // Executar verificação de autenticação apenas para rotas protegidas
    async function performAuthCheck() {
      try {
        await checkAuth();
      } catch (error) {
        console.error("Erro ao verificar autenticação inicial:", error);
      } finally {
        // Marcando que a verificação inicial foi realizada
        setDidPerformInitialCheck(true);
      }
    }
    
    performAuthCheck();
    
    // Limpar cookies e sessão se detectarmos uma condição inconsistente
    if (isAuthenticated && !isReallyAuthenticated) {
      console.warn("Estado de autenticação inconsistente detectado. Limpando estado...");
      // Limpar qualquer sessão ou cookie inválidos
      localStorage.removeItem("auth_session");
      sessionStorage.removeItem("auth_token");
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    }
  }, [checkAuth, isAuthenticated, isReallyAuthenticated]);

  return (
    <Switch>
      <Route path="/" component={Home}/>
      
      {/* Rota setup (também deve ser protegida) */}
      <Route path="/setup">
        <PrivateRoute>
          <Setup />
        </PrivateRoute>
      </Route>
      
      {/* Rotas públicas */}
      <Route path="/login" component={Login}/>
      <Route path="/onboarding" component={Onboarding}/>
      
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
      
      <Route path="/admin/plans">
        <PrivateRoute>
          <Plans />
        </PrivateRoute>
      </Route>
      
      <Route path="/admin/system-users">
        <PrivateRoute>
          <SystemUsers />
        </PrivateRoute>
      </Route>
      
      <Route path="/admin/subscribers">
        <PrivateRoute>
          <Subscribers />
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
