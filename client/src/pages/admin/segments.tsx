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

import { columns } from '@/components/segments/columns';
import { DataTable } from '@/components/segments/data-table';
import { SegmentForm } from '@/components/segments/segment-form';
import { Segment, SegmentFormValues } from '@/components/segments/types';
import { segmentsService } from '@/lib/api-segments';

export default function SegmentsPage() {
  const queryClient = useQueryClient();
  
  // Estados locais
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);

  // Consulta para buscar segmentos
  const {
    data: segments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['segments'],
    queryFn: async () => {
      // Chamada direta para garantir o processamento correto
      try {
        console.log('Buscando segmentos...');
        const data = await segmentsService.getAll();
        console.log('Segmentos recebidos da API:', data);
        
        // Mapear os campos para garantir compatibilidade com a interface
        const segmentsMapped = data.map(segment => ({
          ...segment,
          nome: segment.name,
          descricao: segment.description
        }));
        
        console.log('Segmentos mapeados:', segmentsMapped);
        return segmentsMapped;
      } catch (error) {
        console.error('Erro ao buscar segmentos:', error);
        throw error;
      }
    },
    refetchOnWindowFocus: true,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: segmentsService.create,
    onSuccess: () => {
      toast.success('Segmento criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['segments'] });
      setFormOpen(false);
    },
    onError: () => {
      toast.error('Erro ao criar segmento.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; values: SegmentFormValues }) =>
      segmentsService.update(data.id, data.values),
    onSuccess: () => {
      toast.success('Segmento atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['segments'] });
      setFormOpen(false);
      setSelectedSegment(null);
    },
    onError: () => {
      toast.error('Erro ao atualizar segmento.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => segmentsService.delete(id),
    onSuccess: () => {
      toast.success('Segmento excluído com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['segments'] });
      setDeleteDialogOpen(false);
      setSelectedSegment(null);
    },
    onError: () => {
      toast.error('Erro ao excluir segmento.');
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (data: { id: string; isActive: boolean }) =>
      segmentsService.updateStatus(data.id, data.isActive),
    onSuccess: (data) => {
      toast.success(`Segmento ${data.is_active ? 'ativado' : 'desativado'} com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ['segments'] });
    },
    onError: () => {
      toast.error('Erro ao atualizar status do segmento.');
      queryClient.invalidateQueries({ queryKey: ['segments'] });
    },
  });

  // Handlers
  const handleOpenForm = (segment?: Segment) => {
    setSelectedSegment(segment || null);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedSegment(null);
  };

  const handleSubmit = (values: SegmentFormValues) => {
    if (selectedSegment) {
      updateMutation.mutate({ id: selectedSegment.id, values });
    } else {
      createMutation.mutate(values);
    }
  };

  const handleDelete = (segment: Segment) => {
    setSelectedSegment(segment);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedSegment) {
      deleteMutation.mutate(selectedSegment.id);
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
          <h2 className="text-2xl font-bold mb-6">Segmentos</h2>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Erro ao carregar segmentos. Tente novamente mais tarde.</p>
            <Button 
              variant="outline" 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['segments'] })}
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
          <h2 className="text-2xl font-bold">Segmentos</h2>
          
          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Segmento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{selectedSegment ? 'Editar Segmento' : 'Novo Segmento'}</DialogTitle>
                <DialogDescription>
                  {selectedSegment
                    ? 'Edite as informações do segmento existente.'
                    : 'Preencha os dados para criar um novo segmento.'}
                </DialogDescription>
              </DialogHeader>
              <SegmentForm
                segment={selectedSegment || undefined}
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
            data={segments}
            isLoading={isLoading}
            onEdit={handleOpenForm}
            onDelete={handleDelete}
            updateSegmentStatus={handleUpdateStatus}
          />
        )}
      </div>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Segmento</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja excluir o segmento <strong>{selectedSegment?.name}</strong>?<br />
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