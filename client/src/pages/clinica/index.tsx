import React from 'react';
import DynamicAppShell from '@/components/layout/dynamic-app-shell';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, Tooth, Activity } from 'lucide-react';

export default function ClinicaDashboard() {
  const { user } = useAuth();

  return (
    <DynamicAppShell title="Dashboard da Clínica" subtitle="Visão Geral">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bem-vindo, {user?.name || 'Gestor'}</h1>
          <p className="text-muted-foreground">
            Perfil: Dono de Clínica
          </p>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pacientes Ativos</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">325</div>
              <p className="text-xs text-muted-foreground">
                +18 novos este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atendimentos Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                2 aguardando confirmação
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Procedimentos</CardTitle>
              <Tooth className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">145</div>
              <p className="text-xs text-muted-foreground">
                Realizados este mês
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
                +5% comparado ao mês anterior
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Agenda do Dia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <p className="text-sm font-medium">09:00 - Maria Silva</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full">Confirmado</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                    <p className="text-sm font-medium">10:30 - João Pereira</p>
                  </div>
                  <span className="text-xs bg-amber-100 text-amber-800 py-1 px-2 rounded-full">Aguardando</span>
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
    </DynamicAppShell>
  );
}