import React from 'react';
import DynamicAppShell from '@/components/layout/dynamic-app-shell';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Users, Building, Settings } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <DynamicAppShell title="Dashboard Admin" subtitle="Visão Geral">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bem-vindo, {user?.name || 'Administrador'}</h1>
          <p className="text-muted-foreground">
            Perfil: {user?.role === 'SUPER_ADMIN' ? 'Super Administrador' : 'Diretor'}
          </p>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assinantes Ativos</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">25</div>
              <p className="text-xs text-muted-foreground">
                +3 novos este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Totais</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">145</div>
              <p className="text-xs text-muted-foreground">
                +12% comparado ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faturamento Mensal</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 45.231,89</div>
              <p className="text-xs text-muted-foreground">
                +5% comparado ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Segmentos Ativos</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                +1 novo segmento este mês
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Relatório de Crescimento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center border rounded-md bg-muted/20">
                <p className="text-muted-foreground">Gráfico de crescimento (placeholder)</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <div>
                    <p className="text-sm font-medium">Novo assinante cadastrado</p>
                    <p className="text-xs text-muted-foreground">Clínica Sorrisos - há 2 horas</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <div>
                    <p className="text-sm font-medium">Novo plano criado</p>
                    <p className="text-xs text-muted-foreground">Plano Odonto Premium - há 4 horas</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <div>
                    <p className="text-sm font-medium">Módulo atualizado</p>
                    <p className="text-xs text-muted-foreground">Módulo de Agendamento - há 1 dia</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DynamicAppShell>
  );
}