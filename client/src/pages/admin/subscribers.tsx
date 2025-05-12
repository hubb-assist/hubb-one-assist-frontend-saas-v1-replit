import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import AppShell from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/subscribers/data-table';
import { columns } from '@/components/subscribers/columns';
import SubscriberDetailView from '@/components/subscribers/subscriber-detail';
import { SubscriberEditForm } from '@/components/subscribers/subscriber-edit-form';
import { subscribersService } from '@/lib/api-subscribers';
import { Subscriber, SubscriberDetail } from '@/components/subscribers/types';
import { DeleteSubscriberDialog } from '@/components/subscribers/delete-subscriber-dialog';
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
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | undefined>(undefined);
  const [subscriberDetail, setSubscriberDetail] = useState<SubscriberDetail | undefined>(undefined);
  const [statusAction, setStatusAction] = useState<'activate' | 'deactivate'>('activate');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [nameFilter, setNameFilter] = useState('');
  const queryClient = useQueryClient();

  // Verificar status do proxy
  const { data: proxyStatus } = useQuery({
    queryKey: ['/api/check-proxy'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/check-proxy');
        return await response.json();
      } catch (error) {
        console.error('Erro ao verificar status do proxy:', error);
        return { status: 'error', message: 'Proxy indisponível' };
      }
    },
    staleTime: Infinity // Não precisa revalidar durante a sessão
  });

  // Calcular os parâmetros de paginação para a API
  const paginationParams = {
    skip: (currentPage - 1) * pageSize,
    limit: pageSize,
    name: nameFilter || undefined
  };

  // Buscar lista de assinantes paginada
  const { 
    data: paginatedSubscribers = { data: [], total: 0, page: 1, pageSize: 10 }, 
    isLoading, 
    error: subscribersError, 
    refetch 
  } = useQuery({
    queryKey: ['/subscribers', paginationParams],
    queryFn: async () => {
      try {
        console.log('Fazendo requisição para API com paginação:', paginationParams);
        const result = await subscribersService.getAll(paginationParams);
        console.log('Dados paginados recebidos:', result);
        return result;
      } catch (error) {
        console.error('Erro ao buscar assinantes:', error);
        toast.error('Erro ao carregar a lista de assinantes');
        throw error;
      }
    },
    retry: 1, // Limitar o número de tentativas
    retryDelay: 1000, // Aguardar 1 segundo entre as tentativas
  });
  
  // Extrair os dados dos assinantes da resposta paginada
  const subscribers = paginatedSubscribers.data;

  // Buscar detalhes de um assinante
  const { isLoading: isLoadingDetail } = useQuery({
    queryKey: ['/subscribers', selectedSubscriber?.id],
    queryFn: async () => {
      if (!selectedSubscriber?.id) return null;
      try {
        console.log(`Buscando detalhes do assinante: /subscribers/${selectedSubscriber.id}/`);
        const data = await subscribersService.getById(selectedSubscriber.id);
        console.log('Detalhes recebidos:', data);
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
      const action = data.isActive ? 'activate' : 'deactivate';
      console.log(`Atualizando status do assinante: /subscribers/${data.id}/${action}/`);
      return subscribersService.updateStatus(data.id, data.isActive);
    },
    onSuccess: (data) => {
      // Invalidar a consulta com os parâmetros atuais de paginação
      queryClient.invalidateQueries({ 
        queryKey: ['/subscribers', paginationParams] 
      });
      toast.success(`Assinante ${data.is_active ? 'ativado' : 'desativado'} com sucesso!`);
      setOpenStatusDialog(false);
    },
    onError: (error) => {
      console.error('Erro ao atualizar status do assinante:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao atualizar status do assinante: ${errorMessage}`);
    },
  });

  // Mutação para editar assinante
  const editMutation = useMutation({
    mutationFn: (data: { id: string; formData: any }) => {
      console.log(`Editando assinante: /subscribers/${data.id}/`);
      return subscribersService.update(data.id, data.formData);
    },
    onSuccess: (data) => {
      // Invalidar a consulta com os parâmetros atuais de paginação
      queryClient.invalidateQueries({ 
        queryKey: ['/subscribers', paginationParams] 
      });
      // Invalidar também os detalhes do assinante se estiver aberto
      if (selectedSubscriber) {
        queryClient.invalidateQueries({ 
          queryKey: ['/subscribers', selectedSubscriber.id] 
        });
      }
      toast.success(`Assinante ${data.name} atualizado com sucesso!`);
      setOpenEditDialog(false);
    },
    onError: (error) => {
      console.error('Erro ao editar assinante:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao editar assinante: ${errorMessage}`);
    },
  });

  // Handlers
  const handleViewDetail = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber);
    setOpenDetailDialog(true);
  };

  const handleEditSubscriber = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber);
    setOpenEditDialog(true);
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
  
  // Handler para mudança de página
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  
  // Handler para filtro por nome
  const handleNameFilterChange = (name: string) => {
    setNameFilter(name);
    setCurrentPage(1); // Voltar para a primeira página ao filtrar
  };
  
  // Handler para exclusão de assinante
  const handleDeleteSubscriber = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber);
    setOpenDeleteDialog(true);
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
    // Verificar o tipo específico de erro para uma mensagem mais precisa
    const errorCode = subscribersError instanceof Error && 'code' in subscribersError 
      ? (subscribersError as any).code 
      : 'UNKNOWN';
    
    const errorStatus = subscribersError instanceof Error && 
      'response' in subscribersError && 
      (subscribersError as any).response?.status;
    
    const errorMessage = subscribersError instanceof Error 
      ? subscribersError.message 
      : 'Erro desconhecido';
    
    let statusDesc = '';
    if (errorStatus === 404) {
      statusDesc = 'Endpoint não encontrado (404)';
    } else if (errorStatus === 401) {
      statusDesc = 'Não autorizado (401) - Verifique a autenticação';
    } else if (errorStatus === 403) {
      statusDesc = 'Acesso proibido (403) - Verifique permissões';
    } else if (errorStatus >= 500) {
      statusDesc = `Erro no servidor (${errorStatus})`;
    } else if (errorCode === 'ERR_NETWORK') {
      statusDesc = 'Erro de conexão de rede - Possível problema de CORS';
    }
    
    return (
      <AppShell>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Assinantes</h2>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refetch()}
              >
                Tentar novamente
              </Button>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-md p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-amber-600 mb-2">
                {statusDesc || 'Endpoint em implementação'}
              </h3>
              <p className="text-gray-600 mb-4">
                Não foi possível conectar ao endpoint <code>/subscribers/</code>.
                {errorStatus === 401 
                  ? ' O usuário atual não possui permissão para acessar este recurso. Este endpoint é protegido e requer uma role específica (como SUPER_ADMIN ou DIRETOR).' 
                  : errorCode === 'ERR_NETWORK' 
                    ? ' Isso pode indicar um problema de CORS (Cross-Origin Resource Sharing) entre o frontend e a API.' 
                    : ' Este endpoint pode estar em implementação ou com problemas temporários.'}
              </p>
              
              {/* Status do proxy */}
              <div className="my-4 p-3 bg-gray-50 rounded-md">
                <h4 className="font-medium text-gray-800 mb-1">Status do proxy</h4>
                {proxyStatus ? (
                  <div className="text-sm">
                    <p>Status: <span className={proxyStatus.status === 'ok' ? 'text-green-600' : 'text-red-600'}>
                      {proxyStatus.status === 'ok' ? 'Funcionando' : 'Com problemas'}
                    </span></p>
                    {proxyStatus.message && <p className="text-gray-600">{proxyStatus.message}</p>}
                    {proxyStatus.proxyTarget && <p className="text-gray-600">Destino: {proxyStatus.proxyTarget}</p>}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">Verificando status do proxy...</p>
                )}
              </div>
              
              <details className="text-sm text-gray-500 mt-4 text-left">
                <summary>Detalhes técnicos (para desenvolvedores)</summary>
                <p className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                  Erro: {errorMessage}
                </p>
                <p className="mt-2">
                  Código: {errorCode}
                </p>
                {errorStatus && (
                  <p className="mt-2">
                    Status HTTP: {errorStatus}
                  </p>
                )}
                <p className="mt-2">
                  Estamos tentando acessar: <code>/subscribers/</code>
                </p>
                <p className="mt-2">
                  De acordo com a documentação, este endpoint deve estar disponível em:
                  <br /><code>https://hubb-one-assist-back-hubb-one.replit.app/subscribers/</code>
                </p>
              </details>
              
              <div className="mt-4 flex justify-center space-x-4">
                <Button
                  onClick={() => refetch()}
                >
                  Tentar novamente
                </Button>
              </div>
            </div>

            <div className="border-t border-amber-200 pt-4 mt-4">
              <h4 className="font-medium text-amber-800 mb-2">Sugestões de resolução:</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {errorCode === 'ERR_NETWORK' && (
                  <>
                    <li>Verificar configurações de CORS no backend para permitir requisições deste domínio</li>
                    <li>Confirmar se o proxy do servidor está configurado corretamente</li>
                  </>
                )}
                {errorStatus === 401 && (
                  <li>Verificar se o token de autenticação está sendo enviado corretamente</li>
                )}
                {errorStatus === 403 && (
                  <li>Confirmar se o usuário logado tem permissões para acessar este recurso</li>
                )}
                {errorStatus === 404 && (
                  <li>Verificar se o caminho do endpoint está correto na implementação frontend e backend</li>
                )}
                <li>Confirmar com a equipe de backend se o endpoint está disponível e funcionando</li>
                <li>Verificar logs no servidor para identificar possíveis erros</li>
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
            {paginatedSubscribers.total} Assinante(s)
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={subscribers}
          totalItems={paginatedSubscribers.total}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          isLoading={isLoading}
          onView={handleViewDetail}
          onEdit={handleEditSubscriber}
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

      {/* Modal de Edição de Assinante */}
      {selectedSubscriber && (
        <SubscriberEditForm
          subscriber={selectedSubscriber}
          open={openEditDialog}
          onOpenChange={setOpenEditDialog}
          onSuccess={() => {
            // Recarregar os dados após edição bem-sucedida
            queryClient.invalidateQueries({ 
              queryKey: ['/subscribers', paginationParams] 
            });
          }}
        />
      )}

      {/* Modal de Exclusão de Assinante */}
      {selectedSubscriber && (
        <DeleteSubscriberDialog
          subscriberId={selectedSubscriber.id}
          subscriberName={selectedSubscriber.name}
          isOpen={openDeleteDialog}
          onOpenChange={setOpenDeleteDialog}
          onSuccess={() => {
            // Recarregar os dados após exclusão bem-sucedida
            queryClient.invalidateQueries({ 
              queryKey: ['/subscribers', paginationParams] 
            });
            setSelectedSubscriber(undefined);
          }}
        />
      )}
    </AppShell>
  );
}