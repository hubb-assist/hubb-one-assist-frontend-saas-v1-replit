import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Loader2 } from 'lucide-react';

import AppShell from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

import { columns } from '@/components/system-users/columns';
import { DataTable } from '@/components/system-users/data-table';
import { UserForm } from '@/components/system-users/user-form';
import { SystemUser, SystemUserCreateValues, SystemUserUpdateValues } from '@/components/system-users/types';
import { systemUsersService } from '@/lib/api-users';

export default function SystemUsersPage() {
  const queryClient = useQueryClient();
  
  // Estados locais
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);

  // Consulta para buscar usuários do sistema
  const {
    data: users = [],
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
  } = useQuery({
    queryKey: ['system-users'],
    queryFn: async () => {
      try {
        console.log('Buscando usuários do sistema...');
        return await systemUsersService.getAll();
      } catch (error) {
        console.error('Erro ao buscar usuários do sistema:', error);
        throw error;
      }
    },
    refetchOnWindowFocus: true,
  });

  // Mutation para criar usuário
  const createMutation = useMutation({
    mutationFn: systemUsersService.create,
    onSuccess: () => {
      toast.success('Usuário criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['system-users'] });
      setFormOpen(false);
    },
    onError: () => {
      toast.error('Erro ao criar usuário.');
    },
  });

  // Mutation para atualizar usuário
  const updateMutation = useMutation({
    mutationFn: (data: { id: string; values: SystemUserUpdateValues }) =>
      systemUsersService.update(data.id, data.values),
    onSuccess: () => {
      toast.success('Usuário atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['system-users'] });
      setFormOpen(false);
      setSelectedUser(null);
    },
    onError: () => {
      toast.error('Erro ao atualizar usuário.');
    },
  });

  // Mutation para excluir usuário
  const deleteMutation = useMutation({
    mutationFn: (id: string) => systemUsersService.delete(id),
    onSuccess: () => {
      toast.success('Usuário excluído com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['system-users'] });
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    },
    onError: () => {
      toast.error('Erro ao excluir usuário.');
    },
  });

  // Mutation para ativar usuário
  const activateMutation = useMutation({
    mutationFn: (id: string) => systemUsersService.activate(id),
    onSuccess: (data) => {
      toast.success('Usuário ativado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['system-users'] });
    },
    onError: () => {
      toast.error('Erro ao ativar usuário.');
      queryClient.invalidateQueries({ queryKey: ['system-users'] });
    },
  });

  // Mutation para desativar usuário
  const deactivateMutation = useMutation({
    mutationFn: (id: string) => systemUsersService.deactivate(id),
    onSuccess: (data) => {
      toast.success('Usuário desativado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['system-users'] });
    },
    onError: () => {
      toast.error('Erro ao desativar usuário.');
      queryClient.invalidateQueries({ queryKey: ['system-users'] });
    },
  });

  // Handlers
  const handleOpenForm = (user?: SystemUser) => {
    console.log("Abrindo formulário para usuário:", user?.name || "novo");
    setSelectedUser(user || null);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    console.log("Fechando formulário");
    setFormOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = (values: SystemUserCreateValues | SystemUserUpdateValues) => {
    console.log("Enviando dados do formulário:", values);
    if (selectedUser) {
      console.log("Atualizando usuário existente:", selectedUser.id);
      updateMutation.mutate({ id: selectedUser.id, values: values as SystemUserUpdateValues });
    } else {
      console.log("Criando novo usuário");
      createMutation.mutate(values as SystemUserCreateValues);
    }
  };

  const handleDelete = (user: SystemUser) => {
    console.log("SystemUsersPage: handleDelete chamado para usuário:", user.name);
    // Verificação para garantir que o usuário é válido
    if (!user || !user.id) {
      console.error("Usuário inválido recebido em handleDelete");
      toast.error("Erro ao selecionar usuário para exclusão");
      return;
    }
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log("SystemUsersPage: confirmDelete chamado para usuário:", selectedUser?.name);
    if (selectedUser) {
      console.log("Chamando API para excluir usuário ID:", selectedUser.id);
      deleteMutation.mutate(selectedUser.id);
    }
  };

  const handleUpdateStatus = (id: string, isActive: boolean) => {
    console.log("SystemUsersPage: handleUpdateStatus chamado para usuário ID:", id, "novo status:", isActive);
    if (isActive) {
      activateMutation.mutate(id);
    } else {
      deactivateMutation.mutate(id);
    }
  };

  // Se ocorrer um erro na consulta principal
  if (isErrorUsers) {
    return (
      <AppShell>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-6">Usuários do Sistema</h2>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Erro ao carregar usuários do sistema. Tente novamente mais tarde.</p>
            <Button 
              variant="outline" 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['system-users'] })}
              className="mt-2"
            >
              Tentar novamente
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Usuários do Sistema</h2>
          
          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            {formOpen && (
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{selectedUser ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
                  <DialogDescription>
                    {selectedUser
                      ? 'Edite as informações do usuário existente.'
                      : 'Preencha os dados para criar um novo usuário do sistema.'}
                  </DialogDescription>
                </DialogHeader>
                <UserForm
                  user={selectedUser || undefined}
                  onSubmit={handleSubmit}
                  onCancel={handleCloseForm}
                  isSubmitting={createMutation.isPending || updateMutation.isPending}
                />
              </DialogContent>
            )}
          </Dialog>
        </div>

        {isLoadingUsers ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={users}
            onEdit={handleOpenForm}
            onDelete={handleDelete}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </div>

      {/* Dialog de confirmação de exclusão */}
      {deleteDialogOpen && (
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Usuário</AlertDialogTitle>
              <AlertDialogDescription>
                Você tem certeza que deseja excluir o usuário <strong>{selectedUser?.name}</strong>?<br />
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </AppShell>
  );
}