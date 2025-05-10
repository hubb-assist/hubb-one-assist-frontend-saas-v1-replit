import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Plan } from './types';

// Componente separado para os botões de ação
interface ActionButtonsProps {
  plan: Plan;
  onEdit: (plan: Plan) => void;
  onDelete: (plan: Plan) => void;
}

export function ActionButtons({ plan, onEdit, onDelete }: ActionButtonsProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("ActionButtons: Botão editar clicado para plano:", plan.name);
    onEdit(plan);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("ActionButtons: Botão deletar clicado para plano:", plan.name);
    onDelete(plan);
  };
  
  return (
    <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleEdit}
        aria-label={`Editar plano ${plan.name}`}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        aria-label={`Excluir plano ${plan.name}`}
        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}