import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import AppShell from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/subscribers/data-table';
import { columns } from '@/components/subscribers/columns';
import SubscriberDetailView from '@/components/subscribers/subscriber-detail';
import { subscribersService } from '@/lib/api-subscribers';
import { Subscriber, SubscriberDetail } from '@/components/subscribers/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Users } from 'lucide-react';

export default function Subscribers() {
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | undefined>(undefined);
  const [subscriberDetail, setSubscriberDetail] = useState<SubscriberDetail | undefined>(undefined);
  const [statusAction, setStatusAction] = useState<'activate' | 'deactivate'>('activate');
  const queryClient = useQueryClient();

  // Buscar lista de assinantes
  const { data: subscribers = [], isLoading } = useQuery({
    queryKey: ['/api/subscribers'],
    queryFn: async () => {
      try {
        const data = await subscribersService.getAll();
        return data;
      } catch (error) {
        console.error('Erro ao buscar assinantes:', error);
        toast.error('Não foi possível carregar os assinantes');
        return [];
      }
    },
  });

  // Buscar detalhes de um assinante
  const { isLoading: isLoadingDetail } = useQuery({
    queryKey: ['/api/subscribers', selectedSubscriber?.id],
    queryFn: async () => {
      if (!selectedSubscriber?.id) return null;
      try {
        const data = await subscribersService.getById(selectedSubscriber.id);
        setSubscriberDetail(data);
        return data;
      } catch (error) {
        console.error('Erro ao buscar detalhes do assinante:', error);
        toast.error('Não foi possível carregar os detalhes do assinante');
        return null;
      }
    },
    enabled: !!selectedSubscriber?.id && openDetailDialog,
  });

  // Mutação para atualizar status (ativar/desativar)
  const statusMutation = useMutation({
    mutationFn: (data: { id: string; isActive: boolean }) => {
      return subscribersService.updateStatus(data.id, data.isActive);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/subscribers'] });
      toast.success(`Assinante ${data.is_active ? 'ativado' : 'desativado'} com sucesso!`);
      setOpenStatusDialog(false);
    },
    onError: (error) => {
      console.error('Erro ao atualizar status do assinante:', error);
      toast.error('Erro ao atualizar status do assinante. Tente novamente.');
    },
  });

  // Handlers
  const handleViewDetail = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber);
    setOpenDetailDialog(true);
  };

  const handleStatusChange = (subscriber: Subscriber, newStatus: boolean) => {
    setSelectedSubscriber(subscriber);
    setStatusAction(newStatus ? 'activate' : 'deactivate');
    setOpenStatusDialog(true);
  };

  const handleConfirmStatusChange = () => {
    if (selectedSubscriber) {
      statusMutation.mutate({
        id: selectedSubscriber.id,
        isActive: statusAction === 'activate',
      });
    }
  };

  // Se estiver carregando, mostrar indicador de carregamento
  if (isLoading) {
    return (
      <AppShell>
        <div className="flex-1 flex items-center justify-center">
          <p>Carregando assinantes...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Assinantes</h2>
          <Button 
            disabled 
            variant="outline"
          >
            <Users className="h-4 w-4 mr-2" />
            {subscribers.length} Assinante(s)
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={subscribers}
          onView={handleViewDetail}
          onActivate={(subscriber) => handleStatusChange(subscriber, true)}
          onDeactivate={(subscriber) => handleStatusChange(subscriber, false)}
        />
      </div>

      {/* Modal de Detalhes do Assinante */}
      <Dialog open={openDetailDialog} onOpenChange={setOpenDetailDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Assinante</DialogTitle>
            <DialogDescription>
              Informações completas sobre o assinante e seu usuário administrador.
            </DialogDescription>
          </DialogHeader>
          {isLoadingDetail ? (
            <div className="py-10 flex justify-center">
              <p>Carregando detalhes...</p>
            </div>
          ) : subscriberDetail ? (
            <SubscriberDetailView subscriber={subscriberDetail} />
          ) : (
            <div className="py-10 flex justify-center">
              <p>Não foi possível carregar os detalhes do assinante.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de Confirmação de Mudança de Status */}
      <AlertDialog open={openStatusDialog} onOpenChange={setOpenStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar alteração de status</AlertDialogTitle>
            <AlertDialogDescription>
              {statusAction === 'activate'
                ? 'Você tem certeza que deseja ativar este assinante?'
                : 'Você tem certeza que deseja desativar este assinante?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmStatusChange}
              className={statusAction === 'activate' ? 'bg-primary' : 'bg-destructive'}
            >
              {statusMutation.isPending 
                ? 'Processando...' 
                : statusAction === 'activate' 
                  ? 'Ativar' 
                  : 'Desativar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}