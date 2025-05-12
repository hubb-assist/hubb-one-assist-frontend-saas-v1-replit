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
  const { data: subscribers = [], isLoading, error: subscribersError } = useQuery({
    queryKey: ['/api/subscribers'],
    queryFn: async () => {
      try {
        const data = await subscribersService.getAll();
        return data;
      } catch (error) {
        console.error('Erro ao buscar assinantes:', error);
        // Não exibir toast aqui, vamos mostrar um estado de erro na interface
        throw error;
      }
    },
    retry: 1, // Limitar o número de tentativas
    retryDelay: 1000, // Aguardar 1 segundo entre as tentativas
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
  
  // Se houver um erro, exibir mensagem de erro com informações úteis
  if (subscribersError) {
    return (
      <AppShell>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Assinantes</h2>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-md p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-amber-600 mb-2">
                Endpoint em implementação
              </h3>
              <p className="text-gray-600 mb-4">
                Não foi possível conectar ao endpoint <code>/subscribers</code>. 
                De acordo com a documentação da API, esse endpoint existe, mas ainda pode estar em implementação no backend.
              </p>
              <details className="text-sm text-gray-500 mt-4 text-left">
                <summary>Detalhes técnicos (para desenvolvedores)</summary>
                <p className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                  Erro: {subscribersError instanceof Error ? subscribersError.message : 'Erro desconhecido'}
                </p>
                <p className="mt-2">
                  Estamos tentando acessar: <code>/external-api/subscribers</code>
                </p>
                <p className="mt-2">
                  De acordo com a documentação, este endpoint deve estar disponível em:
                  <br /><code>https://hubb-one-assist-back-hubb-one.replit.app/subscribers/</code>
                </p>
              </details>
              <div className="mt-4 flex justify-center space-x-4">
                <Button
                  variant="outline" 
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/subscribers'] })}
                >
                  Tentar novamente
                </Button>
              </div>
            </div>

            <div className="border-t border-amber-200 pt-4 mt-4">
              <h4 className="font-medium text-amber-800 mb-2">Enquanto o endpoint não está disponível, você pode:</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Verificar a implementação do endpoint no backend</li>
                <li>Confirmar com a equipe de backend se o endpoint está disponível e funcionando</li>
                <li>Verificar logs no servidor para identificar possíveis erros</li>
                <li>Confirmar se as credenciais de autenticação estão corretas</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                A interface do assinante está pronta e funcionará automaticamente quando o endpoint estiver disponível.
              </p>
            </div>
          </div>
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