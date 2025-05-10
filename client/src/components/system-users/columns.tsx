import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { SystemUser, roleLabels } from './types';
import { ActionButtons } from './action-buttons';
import { StatusSwitch } from './status-switch';

// Helper para cabeçalhos de colunas que podem ser ordenados
function sortableHeader(column: any, header: string) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      className="whitespace-nowrap"
    >
      {header}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  )
}

// Definição das colunas da tabela
export const columns: ColumnDef<SystemUser>[] = [
  // Coluna de Nome
  {
    accessorKey: 'name',
    header: ({ column }) => sortableHeader(column, 'Nome'),
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  
  // Coluna de E-mail
  {
    accessorKey: 'email',
    header: ({ column }) => sortableHeader(column, 'E-mail'),
    cell: ({ row }) => <div className="text-muted-foreground">{row.original.email}</div>,
  },
  
  // Coluna de Cargo (Role)
  {
    accessorKey: 'role',
    header: ({ column }) => sortableHeader(column, 'Cargo'),
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <Badge variant="outline" className="font-medium">
          {roleLabels[role] || role}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  
  // Coluna de Status
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => {
      const user = row.original;
      
      return (
        <StatusSwitch
          user={user}
          onStatusChange={(e) => row.onStatusChange?.(e)}
        />
      );
    },
  },
  
  // Coluna de Data de Criação
  {
    accessorKey: 'created_at',
    header: ({ column }) => sortableHeader(column, 'Criado em'),
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      const formattedDate = format(date, 'dd/MM/yyyy');
      const relativeDate = formatDistanceToNow(date, { 
        addSuffix: true, 
        locale: ptBR 
      });
      
      return (
        <div className="text-xs text-muted-foreground">
          <span title={formattedDate}>{relativeDate}</span>
        </div>
      );
    },
    sortingFn: 'datetime',
  },
  
  // Coluna de Ações
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const user = row.original;
      
      return (
        <ActionButtons
          user={user}
          onEdit={() => row.onEdit?.(user)}
          onDelete={() => row.onDelete?.(user)}
        />
      );
    },
  },
];