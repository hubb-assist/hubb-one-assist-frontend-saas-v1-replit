import React, { useEffect, useState } from 'react';
import { Redirect, useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const location = useLocation()[0];
  const { isAuthenticated, isLoading, checkAuth } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verificarAutenticacao = async () => {
      await checkAuth();
      setIsChecking(false);
    };

    verificarAutenticacao();
  }, [checkAuth]);

  if (isChecking || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Verificando autenticação...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Armazenar a URL atual para redirecionamento após o login
    sessionStorage.setItem('redirectTo', location);
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
}