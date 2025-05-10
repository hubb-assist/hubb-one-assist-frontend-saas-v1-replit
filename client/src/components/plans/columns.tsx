import React from 'react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plan } from './types';
import { formatCurrency } from '@/lib/utils';

// Helper para criar cabeçalhos de coluna ordenáveis
function sortableHeader(column: any, header: string) {
  return {
    header: ({ column }: { column: any }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="p-0 font-medium text-muted-foreground hover:text-primary hover:bg-transparent"
        >
          {header}
          <span className="text-xs ml-1">
            {column.getIsSorted() === 'asc' ? '↑' : column.getIsSorted() === 'desc' ? '↓' : ''}
          </span>
        </Button>
      );
    },
  };
}

// Definição das colunas da tabela de planos
export const columns: ColumnDef<Plan>[] = [
  {
    accessorKey: 'name',
    ...sortableHeader('name', 'Nome'),
    cell: ({ row }) => (
      <div className="font-medium">{row.original.name || row.original.nome}</div>
    ),
  },
  {
    accessorKey: 'segment',
    header: 'Segmento',
    cell: ({ row }) => {
      const segmentName = row.original.segment?.name || row.original.segment?.nome || 'Não definido';
      return <div>{segmentName}</div>;
    },
  },
  {
    accessorKey: 'base_price',
    ...sortableHeader('base_price', 'Preço Base'),
    cell: ({ row }) => (
      <div>{formatCurrency(row.original.base_price)}</div>
    ),
  },
  {
    id: 'total_price',
    header: 'Preço Total',
    cell: ({ row }) => {
      const basePrice = row.original.base_price || 0;
      const modulesPrice = row.original.modules?.reduce((total, mod) => {
        // Calcular o preço dos módulos - API retorna no formato 'price'
        const modulePrice = typeof mod.price === 'number' ? mod.price : 0;
        // Consideramos o módulo gratuito se a propriedade is_free existir e for true,
        // ou se o preço for zero ou não existir
        const isFree = (mod.is_free === true) || (!modulePrice);
        return total + (isFree ? 0 : modulePrice);
      }, 0) || 0;
      
      // Somar preço base + preço dos módulos
      const totalPrice = basePrice + modulesPrice;
      
      return (
        <div className="font-medium">{formatCurrency(totalPrice)}</div>
      );
    },
  },
  {
    accessorKey: 'modules',
    header: 'Módulos',
    cell: ({ row }) => (
      <Badge variant="outline" className="px-2 py-1 text-xs font-normal">
        {row.original.modules?.length || 0} módulos
      </Badge>
    ),
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => {
      const plan = row.original;
      
      // @ts-ignore - row.table existe mas o TS não reconhece
      const meta = (row.table?.options?.meta as any) || {};
      const updatePlanStatus = meta.updatePlanStatus;
      
      if (!updatePlanStatus) {
        return (
          <div className="flex items-center">
            <span className="ml-2 text-xs text-muted-foreground">
              {plan.is_active ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        );
      }
      
      // Usando StatusSwitch ao invés de código direto
      const StatusSwitch = require('./status-switch').StatusSwitch;
      return <StatusSwitch plan={plan} onUpdateStatus={updatePlanStatus} />;
    },
  },
  {
    accessorKey: 'created_at',
    ...sortableHeader('created_at', 'Criado'),
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return (
        <div className="text-sm text-muted-foreground">
          {formatDistanceToNow(date, { addSuffix: true, locale: ptBR })}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const plan = row.original;
      
      // Obter as funções diretamente do meta
      // @ts-ignore - row.table existe mas o TS não reconhece
      const meta = (row.table?.options?.meta as any) || {};
      const onEdit = meta.onEdit;
      const onDelete = meta.onDelete;
      
      // Adicionando log para debugging e envolvendo em div com pointer-events-auto
      const handleEditClick = () => {
        console.log("Botão editar clicado para plano:", plan.name);
        if (typeof onEdit === 'function') {
          onEdit(plan);
        } else {
          console.error("Função onEdit não está disponível");
        }
      };
      
      const handleDeleteClick = () => {
        console.log("Botão excluir clicado para plano:", plan.name);
        if (typeof onDelete === 'function') {
          onDelete(plan);
        } else {
          console.error("Função onDelete não está disponível");
        }
      };
      
      return (
        <div className="flex items-center space-x-2 pointer-events-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEditClick}
            aria-label={`Editar plano ${plan.name}`}
            className="pointer-events-auto"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDeleteClick}
            aria-label={`Excluir plano ${plan.name}`}
            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 pointer-events-auto"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];