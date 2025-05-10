import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Plan } from './types';

// Componente separado para o switch de status
interface StatusSwitchProps {
  plan: Plan;
  onUpdateStatus: (id: string, status: boolean) => void;
}

export function StatusSwitch({ plan, onUpdateStatus }: StatusSwitchProps) {
  const handleStatusChange = (checked: boolean) => {
    console.log("StatusSwitch: Status alterado para plano:", plan.name, "Novo valor:", checked);
    onUpdateStatus(plan.id, checked);
  };
  
  return (
    <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
      <Switch
        checked={plan.is_active}
        onCheckedChange={handleStatusChange}
        aria-label={`Status do plano ${plan.name}`}
      />
      <span className="ml-2 text-xs text-muted-foreground">
        {plan.is_active ? 'Ativo' : 'Inativo'}
      </span>
    </div>
  );
}