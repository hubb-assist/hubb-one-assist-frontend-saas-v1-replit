import React from 'react';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, ShoppingCart, PercentSquare, DollarSign } from 'lucide-react';
import DashboardWrapper from '@/components/dashboard/dashboard-wrapper';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Dados de exemplo para os gráficos (no mundo real, viriam de uma API)
const receitaMensalData = [
  { mes: 'Jan', valor: 5000 },
  { mes: 'Fev', valor: 6500 },
  { mes: 'Mar', valor: 8200 },
  { mes: 'Abr', valor: 7800 },
  { mes: 'Mai', valor: 9100 },
  { mes: 'Jun', valor: 10500 },
  { mes: 'Jul', valor: 11200 },
];

const novosClientesData = [
  { mes: 'Jan', valor: 120 },
  { mes: 'Fev', valor: 140 },
  { mes: 'Mar', valor: 160 },
  { mes: 'Abr', valor: 155 },
  { mes: 'Mai', valor: 185 },
  { mes: 'Jun', valor: 210 },
  { mes: 'Jul', valor: 245 },
];

export default function ClinicaDashboard() {
  const { user } = useAuth();

  return (
    <DashboardWrapper 
      title="Dashboard" 
      subtitle="Visão Geral"
      requiredRoles={['DONO_ASSINANTE']}
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
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <div className="h-8 w-8 rounded-md bg-green-500 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 87.500</div>
              <div className="flex items-center mt-1">
                <span className="text-xs font-medium text-green-600">↑ 12% em relação ao mês anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Novos Clientes</CardTitle>
              <div className="h-8 w-8 rounded-md bg-blue-500 flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">245</div>
              <div className="flex items-center mt-1">
                <span className="text-xs font-medium text-green-600">↑ 8% em relação ao mês anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atendimentos</CardTitle>
              <div className="h-8 w-8 rounded-md bg-purple-500 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.325</div>
              <div className="flex items-center mt-1">
                <span className="text-xs font-medium text-green-600">↑ 5% em relação ao mês anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <div className="h-8 w-8 rounded-md bg-red-500 flex items-center justify-center">
                <PercentSquare className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24%</div>
              <div className="flex items-center mt-1">
                <span className="text-xs font-medium text-red-600">↓ 2% em relação ao mês anterior</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Receita Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={receitaMensalData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => value >= 1000 ? `${Math.floor(value / 1000)}k` : value}
                      domain={[0, 'dataMax + 1000']}
                    />
                    <Tooltip formatter={(value) => [`R$ ${value}`, 'Receita']} />
                    <Line 
                      type="monotone" 
                      dataKey="valor" 
                      stroke="#7C3AED" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Novos Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={novosClientesData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      domain={[0, 'dataMax + 20']} 
                    />
                    <Tooltip formatter={(value) => [value, 'Clientes']} />
                    <Bar 
                      dataKey="valor" 
                      fill="#f87171" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 grid-cols-1">
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
        </div>
      </div>
    </DashboardWrapper>
  );
}