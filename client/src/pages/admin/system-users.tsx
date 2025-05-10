import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import AppShell from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/system-users/data-table';
import { columns } from '@/components/system-users/columns';
import UserForm from '@/components/system-users/user-form';
import { systemUsersService } from '@/lib/api-users';
import { SystemUser, SystemUserCreateValues, SystemUserUpdateValues } from '@/components/system-users/types';
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
import { UserPlus } from 'lucide-react';

export default function SystemUsers() {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUser | undefined>(undefined);
  const queryClient = useQueryClient();

  // Buscar lista de usuários
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['/api/users'],
    queryFn: async () => {
      try {
        const data = await systemUsersService.getAll();
        return data;
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        toast.error('Não foi possível carregar os usuários');
        return [];
      }
    },
  });

  // Mutação para criar ou atualizar usuário
  const mutation = useMutation({
    mutationFn: (data: { id?: string; values: SystemUserCreateValues | SystemUserUpdateValues }) => {
      if (data.id) {
        return systemUsersService.update(data.id, data.values as SystemUserUpdateValues);
      } else {
        return systemUsersService.create(data.values as SystemUserCreateValues);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      setOpenDialog(false);
      toast.success(selectedUser ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!');
      setSelectedUser(undefined);
    },
    onError: (error) => {
      console.error('Erro ao salvar usuário:', error);
      toast.error(selectedUser ? 
        'Erro ao atualizar usuário. Tente novamente.' : 
        'Erro ao criar usuário. Tente novamente.');
    },
  });

  // Mutação para deletar usuário
  const deleteMutation = useMutation({
    mutationFn: (id: string) => systemUsersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      setOpenDeleteDialog(false);
      toast.success('Usuário excluído com sucesso!');
      setSelectedUser(undefined);
    },
    onError: (error) => {
      console.error('Erro ao excluir usuário:', error);
      toast.error('Erro ao excluir usuário. Tente novamente.');
    },
  });

  // Mutação para atualizar status (ativar/desativar)
  const statusMutation = useMutation({
    mutationFn: (data: { id: string; isActive: boolean }) => {
      return data.isActive
        ? systemUsersService.activate(data.id)
        : systemUsersService.deactivate(data.id);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast.success(`Usuário ${data.is_active ? 'ativado' : 'desativado'} com sucesso!`);
    },
    onError: (error) => {
      console.error('Erro ao atualizar status do usuário:', error);
      toast.error('Erro ao atualizar status do usuário. Tente novamente.');
    },
  });

  // Handlers
  const handleOpenForm = (user?: SystemUser) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleDelete = (user: SystemUser) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      deleteMutation.mutate(selectedUser.id);
    }
  };

  const handleSubmit = async (values: SystemUserCreateValues | SystemUserUpdateValues) => {
    mutation.mutate({
      id: selectedUser?.id,
      values,
    });
  };

  const handleUpdateStatus = (id: string, isActive: boolean) => {
    statusMutation.mutate({ id, isActive });
  };

  // Se estiver carregando, mostrar indicador de carregamento
  if (isLoading) {
    return (
      <AppShell>
        <div className="flex-1 flex items-center justify-center">
          <p>Carregando usuários...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Usuários do Sistema</h2>
          <Button 
            onClick={() => handleOpenForm()}
            className="bg-primary hover:bg-primary/90"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={users}
          onEdit={handleOpenForm}
          onDelete={handleDelete}
          onStatusChange={(user: SystemUser, status: boolean) => handleUpdateStatus(user.id, status)}
        />
      </div>

      {/* Diálogo para Criar/Editar Usuário */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedUser ? 'Editar Usuário' : 'Criar Novo Usuário'}</DialogTitle>
            <DialogDescription>
              {selectedUser
                ? 'Atualize os dados do usuário no formulário abaixo.'
                : 'Preencha os dados para criar um novo usuário.'}
            </DialogDescription>
          </DialogHeader>
          <UserForm
            user={selectedUser}
            onSubmit={handleSubmit}
            onCancel={() => setOpenDialog(false)}
            isLoading={mutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo de Confirmação de Exclusão */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja excluir o usuário "{selectedUser?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}