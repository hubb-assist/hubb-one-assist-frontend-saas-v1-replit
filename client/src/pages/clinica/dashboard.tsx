import React from 'react';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, Scroll, Activity } from 'lucide-react';
import { AppShellClinic } from '@/components/layout/app-shells';

export default function ClinicaDashboard() {
  const { user } = useAuth();

  return (
    <AppShellClinic
      title="Dashboard da Clínica" 
      subtitle="Visão Geral"
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bem-vindo, {user?.name || 'Gestor'}</h1>
          <p className="text-muted-foreground">
            Perfil: Gestor de Assinante
          </p>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Consultas Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                4 confirmadas, 8 pendentes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pacientes Ativos</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">245</div>
              <p className="text-xs text-muted-foreground">
                +8% comparado ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Procedimentos Realizados</CardTitle>
              <Scroll className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98</div>
              <p className="text-xs text-muted-foreground">
                Este mês, +12% comparado ao anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-xs text-muted-foreground">
                +5% comparado à última semana
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos para Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                    <p className="text-sm font-medium">09:00 - João Silva</p>
                  </div>
                  <span className="text-xs bg-amber-100 text-amber-800 py-1 px-2 rounded-full">Pendente</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <p className="text-sm font-medium">10:30 - Maria Santos</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full">Confirmado</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <p className="text-sm font-medium">13:00 - Ana Souza</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full">Confirmado</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <p className="text-sm font-medium">15:30 - Carlos Oliveira</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full">Confirmado</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Desempenho Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center border rounded-md bg-muted/20">
                <p className="text-muted-foreground">Gráfico de desempenho (placeholder)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShellClinic>
  );
}