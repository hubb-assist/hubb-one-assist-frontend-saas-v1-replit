import React, { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { subscribersService } from '@/lib/api-subscribers';

// Interface para props do componente
interface DeleteSubscriberDialogProps {
  subscriberId: string;
  subscriberName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DeleteSubscriberDialog({
  subscriberId,
  subscriberName,
  isOpen,
  onOpenChange,
  onSuccess
}: DeleteSubscriberDialogProps) {
  // Estado para controlar o carregamento durante a exclusão
  const [isDeleting, setIsDeleting] = useState(false);
  // Estado para rastrear erros durante a exclusão
  const [error, setError] = useState<string | null>(null);

  // Função para lidar com a exclusão do assinante
  const handleDelete = async () => {
    if (!subscriberId) return;
    
    // Limpar erro anterior
    setError(null);
    setIsDeleting(true);
    
    try {
      // Chamar serviço para excluir o assinante
      await subscribersService.delete(subscriberId);
      
      // Exibir mensagem de sucesso
      toast.success('Assinante excluído com sucesso');
      
      // Fechar modal e atualizar lista
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      // Tratamento específico de erros conhecidos
      const errorMessage = error.message || 'Erro ao excluir assinante';
      setError(errorMessage);
      
      // Mostrar toast de erro
      toast.error(errorMessage);
      
      // Se o erro for "não encontrado", fechar o modal e atualizar a lista
      if (error.message.includes('não encontrado')) {
        onOpenChange(false);
        onSuccess();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirmar exclusão
          </AlertDialogTitle>
          <AlertDialogDescription>
            Você está prestes a excluir o assinante <strong className="font-semibold text-foreground">{subscriberName}</strong>. 
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
          
          {/* Exibir mensagem de erro se houver */}
          {error && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
              {error}
            </div>
          )}
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isDeleting ? 'Excluindo...' : 'Sim, excluir'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}