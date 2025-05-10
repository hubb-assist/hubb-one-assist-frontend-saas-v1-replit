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

import { columns } from '@/components/plans/columns';
import { DataTable } from '@/components/plans/data-table';
import { PlanForm } from '@/components/plans/plan-form';
import { Plan, PlanFormValues } from '@/components/plans/types';
import { plansService } from '@/lib/api-plans';
import { segmentsService } from '@/lib/api-segments';
import { modulesService } from '@/lib/api-modules';

export default function PlansPage() {
  const queryClient = useQueryClient();
  
  // Estados locais
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // Consulta para buscar planos
  const {
    data: plans = [],
    isLoading: isLoadingPlans,
    isError: isErrorPlans,
  } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      try {
        console.log('Buscando planos...');
        return await plansService.getAll();
      } catch (error) {
        console.error('Erro ao buscar planos:', error);
        throw error;
      }
    },
    refetchOnWindowFocus: true,
  });

  // Consulta para buscar segmentos (necessários para o formulário)
  const {
    data: segments = [],
    isLoading: isLoadingSegments,
  } = useQuery({
    queryKey: ['segments'],
    queryFn: async () => {
      try {
        console.log('Buscando segmentos para o formulário de planos...');
        return await segmentsService.getAll({ is_active: true });
      } catch (error) {
        console.error('Erro ao buscar segmentos:', error);
        return [];
      }
    },
  });

  // Consulta para buscar módulos (necessários para o formulário)
  const {
    data: modules = [],
    isLoading: isLoadingModules,
  } = useQuery({
    queryKey: ['modules'],
    queryFn: async () => {
      try {
        console.log('Buscando módulos para o formulário de planos...');
        return await modulesService.getAll({ is_active: true });
      } catch (error) {
        console.error('Erro ao buscar módulos:', error);
        return [];
      }
    },
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: plansService.create,
    onSuccess: () => {
      toast.success('Plano criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      setFormOpen(false);
    },
    onError: () => {
      toast.error('Erro ao criar plano.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; values: PlanFormValues }) =>
      plansService.update(data.id, data.values),
    onSuccess: () => {
      toast.success('Plano atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      setFormOpen(false);
      setSelectedPlan(null);
    },
    onError: () => {
      toast.error('Erro ao atualizar plano.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => plansService.delete(id),
    onSuccess: () => {
      toast.success('Plano excluído com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      setDeleteDialogOpen(false);
      setSelectedPlan(null);
    },
    onError: () => {
      toast.error('Erro ao excluir plano.');
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (data: { id: string; isActive: boolean }) =>
      plansService.updateStatus(data.id, data.isActive),
    onSuccess: (data) => {
      toast.success(`Plano ${data.is_active ? 'ativado' : 'desativado'} com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
    onError: () => {
      toast.error('Erro ao atualizar status do plano.');
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });

  // Handlers
  const handleOpenForm = (plan?: Plan) => {
    setSelectedPlan(plan || null);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedPlan(null);
  };

  const handleSubmit = (values: PlanFormValues) => {
    if (selectedPlan) {
      updateMutation.mutate({ id: selectedPlan.id, values });
    } else {
      createMutation.mutate(values);
    }
  };

  const handleDelete = (plan: Plan) => {
    console.log("Botão excluir clicado para o plano:", plan);
    setSelectedPlan(plan);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log("Confirmação de exclusão para o plano:", selectedPlan);
    if (selectedPlan) {
      console.log("Chamando API para excluir plano ID:", selectedPlan.id);
      deleteMutation.mutate(selectedPlan.id);
    }
  };

  const handleUpdateStatus = (id: string, isActive: boolean) => {
    updateStatusMutation.mutate({ id, isActive });
  };

  // Formatar os planos para exibição (incluindo dados de segmentos)
  const processedPlans = plans.map(plan => {
    const segment = segments.find(s => s.id === plan.segment_id);
    return {
      ...plan,
      segment,
    };
  });

  // Verificar se está carregando todos os dados necessários
  const isLoading = isLoadingPlans || isLoadingSegments || isLoadingModules;

  // Se ocorrer um erro na consulta principal
  if (isErrorPlans) {
    return (
      <AppShell>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-6">Planos</h2>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Erro ao carregar planos. Tente novamente mais tarde.</p>
            <Button 
              variant="outline" 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['plans'] })}
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
          <h2 className="text-2xl font-bold">Planos</h2>
          
          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Plano
              </Button>
            </DialogTrigger>
            {formOpen && (
              <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{selectedPlan ? 'Editar Plano' : 'Novo Plano'}</DialogTitle>
                  <DialogDescription>
                    {selectedPlan
                      ? 'Edite as informações do plano existente.'
                      : 'Preencha os dados para criar um novo plano.'}
                  </DialogDescription>
                </DialogHeader>
                {!isLoadingSegments && !isLoadingModules ? (
                  <PlanForm
                    plan={selectedPlan || undefined}
                    segments={segments}
                    modules={modules}
                    onSubmit={handleSubmit}
                    onCancel={handleCloseForm}
                    isSubmitting={createMutation.isPending || updateMutation.isPending}
                  />
                ) : (
                  <div className="space-y-4 py-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                )}
              </DialogContent>
            )}
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
            data={processedPlans}
            isLoading={isLoading}
            onEdit={handleOpenForm}
            onDelete={handleDelete}
            updatePlanStatus={handleUpdateStatus}
          />
        )}
      </div>

      {/* Dialog de confirmação de exclusão */}
      {deleteDialogOpen && (
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Plano</AlertDialogTitle>
              <AlertDialogDescription>
                Você tem certeza que deseja excluir o plano <strong>{selectedPlan?.name}</strong>?<br />
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