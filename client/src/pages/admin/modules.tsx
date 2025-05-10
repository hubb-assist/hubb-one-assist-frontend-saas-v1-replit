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

import { columns } from '@/components/modules/columns';
import { DataTable } from '@/components/modules/data-table';
import { ModuleForm } from '@/components/modules/module-form';
import { Module, ModuleFormValues } from '@/components/modules/types';
import { modulesService } from '@/lib/api-modules';

export default function ModulesPage() {
  const queryClient = useQueryClient();
  
  // Estados locais
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  // Consulta para buscar módulos
  const {
    data: modules = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['modules'],
    queryFn: async () => {
      try {
        console.log('Buscando módulos...');
        return await modulesService.getAll();
      } catch (error) {
        console.error('Erro ao buscar módulos:', error);
        throw error;
      }
    },
    refetchOnWindowFocus: true,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: modulesService.create,
    onSuccess: () => {
      toast.success('Módulo criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      setFormOpen(false);
    },
    onError: () => {
      toast.error('Erro ao criar módulo.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; values: ModuleFormValues }) =>
      modulesService.update(data.id, data.values),
    onSuccess: () => {
      toast.success('Módulo atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      setFormOpen(false);
      setSelectedModule(null);
    },
    onError: () => {
      toast.error('Erro ao atualizar módulo.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => modulesService.delete(id),
    onSuccess: () => {
      toast.success('Módulo excluído com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      setDeleteDialogOpen(false);
      setSelectedModule(null);
    },
    onError: () => {
      toast.error('Erro ao excluir módulo.');
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (data: { id: string; isActive: boolean }) =>
      modulesService.updateStatus(data.id, data.isActive),
    onSuccess: (data) => {
      toast.success(`Módulo ${data.is_active ? 'ativado' : 'desativado'} com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ['modules'] });
    },
    onError: () => {
      toast.error('Erro ao atualizar status do módulo.');
      queryClient.invalidateQueries({ queryKey: ['modules'] });
    },
  });

  // Handlers
  const handleOpenForm = (module?: Module) => {
    setSelectedModule(module || null);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedModule(null);
  };

  const handleSubmit = (values: ModuleFormValues) => {
    if (selectedModule) {
      updateMutation.mutate({ id: selectedModule.id, values });
    } else {
      createMutation.mutate(values);
    }
  };

  const handleDelete = (module: Module) => {
    setSelectedModule(module);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedModule) {
      deleteMutation.mutate(selectedModule.id);
    }
  };

  const handleUpdateStatus = (id: string, isActive: boolean) => {
    updateStatusMutation.mutate({ id, isActive });
  };

  // Se ocorrer um erro na consulta
  if (isError) {
    return (
      <AppShell>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-6">Módulos</h2>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Erro ao carregar módulos. Tente novamente mais tarde.</p>
            <Button 
              variant="outline" 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['modules'] })}
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
          <h2 className="text-2xl font-bold">Módulos</h2>
          
          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Módulo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{selectedModule ? 'Editar Módulo' : 'Novo Módulo'}</DialogTitle>
                <DialogDescription>
                  {selectedModule
                    ? 'Edite as informações do módulo existente.'
                    : 'Preencha os dados para criar um novo módulo funcional.'}
                </DialogDescription>
              </DialogHeader>
              <ModuleForm
                module={selectedModule || undefined}
                onSubmit={handleSubmit}
                onCancel={handleCloseForm}
                isSubmitting={createMutation.isPending || updateMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={modules}
            isLoading={isLoading}
            onEdit={handleOpenForm}
            onDelete={handleDelete}
            updateModuleStatus={handleUpdateStatus}
          />
        )}
      </div>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Módulo</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja excluir o módulo <strong>{selectedModule?.name}</strong>?<br />
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
    </AppShell>
  );
}