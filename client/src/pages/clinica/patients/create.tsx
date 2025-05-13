import React from 'react';
import { useAuth } from '@/lib/auth';
import DashboardWrapper from '@/components/dashboard/dashboard-wrapper';
import PatientCreateForm from '@/components/patients/patient-create-form';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

export default function PatientCreatePage() {
  const { user } = useAuth();
  const [_, setLocation] = useLocation();
  
  // Verificar se o usuário tem permissão CAN_CREATE_PATIENT
  // No mundo real, esta verificação seria baseada em dados do JWT ou resposta da API
  const canCreatePatient = user?.role === 'DONO_ASSINANTE' || 
                           user?.role === 'SUPER_ADMIN';
  
  // Se não tiver permissão, mostrar mensagem e redirecionar
  React.useEffect(() => {
    if (!canCreatePatient) {
      toast.error('Você não tem permissão para cadastrar pacientes');
      setLocation('/clinica');
    }
  }, [canCreatePatient, setLocation]);
  
  if (!canCreatePatient) {
    return null; // Não renderizar nada enquanto redireciona
  }
  
  return (
    <DashboardWrapper 
      title="Pacientes" 
      subtitle="Cadastro de Novo Paciente"
      requiredRoles={['DONO_ASSINANTE', 'SUPER_ADMIN']}
    >
      <div className="space-y-6">
        <PatientCreateForm />
      </div>
    </DashboardWrapper>
  );
}