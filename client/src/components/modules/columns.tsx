import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Module } from './types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

function sortableHeader(column: any, header: string) {
  return (
    <Button
      variant="ghost"
      onClick={() => column && typeof column === 'function' && column()}
      className="pl-1 font-medium"
    >
      {header}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}

export const columns: ColumnDef<Module>[] = [
  {
    accessorKey: 'nome',
    header: ({ column }) => sortableHeader(column.getToggleSortingHandler(), 'Nome'),
    cell: ({ row }) => {
      const module = row.original;
      // Usa 'nome' (vindo da API) ou 'name' (caso antigo)
      const displayName = module.nome || module.name || '';
      return <div className="font-medium">{displayName}</div>;
    },
  },
  /* Coluna de descrição removida conforme solicitado */
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => {
      const module = row.original;
      const isActive = module.is_active;
      
      return (
        <div className="flex items-center space-x-2">
          <Switch
            checked={isActive}
            onCheckedChange={(checked) => (
              // Esta função será sobrescrita na DataTable
              (row as any).onStatusChange?.(checked)
            )}
            aria-label={`Mudar status para ${isActive ? 'inativo' : 'ativo'}`}
          />
          <span className={cn(
            "text-xs font-medium",
            isActive ? "text-green-600" : "text-gray-400"
          )}>
            {isActive ? 'Ativo' : 'Inativo'}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => sortableHeader(column.getToggleSortingHandler(), 'Criação'),
    cell: ({ row }) => {
      const date = row.getValue('created_at') as string;
      if (!date) return '-';
      
      try {
        const formatted = format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
        return <div className="text-sm">{formatted}</div>;
      } catch (error) {
        return <div className="text-sm">Data inválida</div>;
      }
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const module = row.original;
      
      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => (row as any).onEdit?.(module)}
            aria-label={`Editar módulo ${module.name}`}
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => (row as any).onDelete?.(module)}
            aria-label={`Excluir módulo ${module.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];