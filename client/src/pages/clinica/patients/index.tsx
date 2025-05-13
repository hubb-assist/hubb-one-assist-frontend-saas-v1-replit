import React from 'react';
import { useAuth } from '@/lib/auth';
import DashboardWrapper from '@/components/dashboard/dashboard-wrapper';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Link } from 'wouter';

export default function PatientsListPage() {
  const { user } = useAuth();
  
  return (
    <DashboardWrapper 
      title="Pacientes" 
      subtitle="Gerenciamento de Pacientes"
      requiredRoles={['DONO_ASSINANTE', 'SUPER_ADMIN']}
    >
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Lista de Pacientes</h1>
            <p className="text-muted-foreground">
              Visualize, edite e gerencie todos os pacientes da sua clínica
            </p>
          </div>
          
          {/* Botão de adicionar novo paciente */}
          <Link href="/clinica/patients/create">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Novo Paciente
            </Button>
          </Link>
        </div>
        
        {/* Aqui virá a tabela com a lista de pacientes (a ser implementada posteriormente) */}
        <div className="rounded-md border p-8 flex items-center justify-center bg-muted/50">
          <div className="text-center">
            <h3 className="text-lg font-medium">
              Funcionalidade em desenvolvimento
            </h3>
            <p className="text-muted-foreground mt-2">
              A listagem de pacientes estará disponível em breve. 
              Por enquanto, você já pode cadastrar novos pacientes.
            </p>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
}