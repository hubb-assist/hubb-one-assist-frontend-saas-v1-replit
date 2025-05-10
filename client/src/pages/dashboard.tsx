import React from "react";
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowUp, ArrowDown, DollarSign, ShoppingCart, Users, Percent } from "lucide-react";

const cardData = [
  {
    title: "Receita Total",
    value: "R$ 87.500",
    description: "↑ 12% em relação ao mês anterior",
    icon: <DollarSign className="h-5 w-5 text-white" />,
    iconClass: "bg-green-500",
    trend: "up"
  },
  {
    title: "Novos Clientes",
    value: "245",
    description: "↑ 8% em relação ao mês anterior",
    icon: <Users className="h-5 w-5 text-white" />,
    iconClass: "bg-blue-500",
    trend: "up"
  },
  {
    title: "Atendimentos",
    value: "1.325",
    description: "↑ 5% em relação ao mês anterior",
    icon: <ShoppingCart className="h-5 w-5 text-white" />,
    iconClass: "bg-purple-500",
    trend: "up"
  },
  {
    title: "Taxa de Conversão",
    value: "24%",
    description: "↓ 2% em relação ao mês anterior",
    icon: <Percent className="h-5 w-5 text-white" />,
    iconClass: "bg-red-500",
    trend: "down"
  }
];

const chartData = [
  { month: "Jan", receita: 5000, clientes: 120 },
  { month: "Fev", receita: 6500, clientes: 145 },
  { month: "Mar", receita: 8000, clientes: 160 },
  { month: "Abr", receita: 7800, clientes: 155 },
  { month: "Mai", receita: 9000, clientes: 180 },
  { month: "Jun", receita: 10500, clientes: 210 },
  { month: "Jul", receita: 11000, clientes: 245 }
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-secondary h-16 fixed top-0 left-0 right-0 z-10 flex items-center px-4">
        <h1 className="text-white text-lg font-medium">Dashboard</h1>
      </div>
      
      <div className="pt-20 px-4 pb-6">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {cardData.map((card, i) => (
            <Card key={i} className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
                    <p className={`text-xs mt-1 ${card.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {card.description}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${card.iconClass}`}>
                    {card.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mt-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Receita Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <defs>
                      <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2D113F" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#2D113F" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="receita" 
                      stroke="#2D113F" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      fill="url(#colorReceita)" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Novos Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <defs>
                      <linearGradient id="colorClientes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C52339" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#C52339" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                      dataKey="clientes" 
                      fill="url(#colorClientes)" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}