import React from 'react';
import { Switch } from '@/components/ui/switch';
import { SystemUser } from './types';

interface StatusSwitchProps {
  user: SystemUser;
  onStatusChange: (checked: boolean) => void;
}

export function StatusSwitch({ user, onStatusChange }: StatusSwitchProps) {
  // Handlers para o evento de mudança de status
  const handleStatusChange = (checked: boolean) => {
    console.log("StatusSwitch: Status alterado para usuário:", user.name, "Novo status:", checked);
    onStatusChange(checked);
  };

  return (
    <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
      <Switch
        checked={user.is_active}
        onCheckedChange={handleStatusChange}
        aria-label="Ativar/Desativar usuário"
      />
      <span className={user.is_active ? "text-green-600" : "text-gray-400"}>
        {user.is_active ? 'Ativo' : 'Inativo'}
      </span>
    </div>
  );
}