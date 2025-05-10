import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SystemUser } from './types';

interface ActionButtonsProps {
  user: SystemUser;
  onEdit: (user: SystemUser) => void;
  onDelete: (user: SystemUser) => void;
}

export function ActionButtons({ user, onEdit, onDelete }: ActionButtonsProps) {
  // Handlers para os eventos de clique
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impedir propagação para evitar seleção da linha
    console.log("ActionButtons: Botão editar clicado para usuário:", user.name);
    onEdit(user);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impedir propagação para evitar seleção da linha
    console.log("ActionButtons: Botão excluir clicado para usuário:", user.name);
    onDelete(user);
  };

  return (
    <div className="flex gap-2 items-center justify-end">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={handleEditClick}
      >
        <Edit className="h-4 w-4" />
        <span className="sr-only">Editar</span>
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 text-destructive hover:bg-destructive/10"
        onClick={handleDeleteClick}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Excluir</span>
      </Button>
    </div>
  );
}