import React from 'react';
import DynamicAppShell from '@/components/layout/dynamic-app-shell';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, FileText, Bell, Clock } from 'lucide-react';

export default function UserDashboard() {
  const { user } = useAuth();

  return (
    <DynamicAppShell title="Painel do Usuário" subtitle="Início">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bem-vindo, {user?.name || 'Usuário'}</h1>
          <p className="text-muted-foreground">
            Perfil: {user?.role === 'PROFISSIONAL' ? 'Profissional' : 'Cliente'}
          </p>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próxima Consulta</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold">15 de Maio, 10:30</div>
              <p className="text-xs text-muted-foreground mt-1">
                Dr. Roberto Andrade
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Procedimentos Pendentes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold">2 procedimentos</div>
              <p className="text-xs text-muted-foreground mt-1">
                Clique para ver detalhes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notificações</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold">3 não lidas</div>
              <p className="text-xs text-muted-foreground mt-1">
                1 importante
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Atendimentos</CardTitle>
              <CardDescription>Seus últimos atendimentos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Consulta de Rotina</p>
                    <p className="text-xs text-muted-foreground">10 de Maio, 2025</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Procedimento Preventivo</p>
                    <p className="text-xs text-muted-foreground">28 de Abril, 2025</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Avaliação Inicial</p>
                    <p className="text-xs text-muted-foreground">15 de Abril, 2025</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações Importantes</CardTitle>
              <CardDescription>Atualizações e notícias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-1">
                  <p className="text-sm font-medium">Novos horários de atendimento</p>
                  <p className="text-xs text-muted-foreground">A partir de 01/06 teremos horários estendidos às quartas-feiras</p>
                </div>
                <div className="border-l-4 border-amber-500 pl-4 py-1">
                  <p className="text-sm font-medium">Campanha de prevenção</p>
                  <p className="text-xs text-muted-foreground">Participe da nossa campanha de prevenção com descontos especiais</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-1">
                  <p className="text-sm font-medium">Novo profissional na equipe</p>
                  <p className="text-xs text-muted-foreground">Recebemos um novo especialista para melhor atendê-lo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DynamicAppShell>
  );
}