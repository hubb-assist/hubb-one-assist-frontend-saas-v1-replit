import React, { useEffect } from 'react';
import AppShell from '@/components/layout/app-shell';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  const handleLogout = async () => {
    await logout();
    toast.success('Logout realizado com sucesso!');
    navigate('/login');
  };

  return (
    <AppShell>
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-6">Painel Administrativo</h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Bem-vindo, {user?.name || 'Administrador'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Você está logado com o e-mail: {user?.email}</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleLogout}
              >
                Sair
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}