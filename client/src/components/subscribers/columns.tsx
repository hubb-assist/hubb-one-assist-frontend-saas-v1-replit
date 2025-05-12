import React from 'react';
import { ColumnDef, TableMeta } from '@tanstack/react-table';

// Meta data de tabela com callbacks
declare module '@tanstack/react-table' {
  interface TableMeta<TData extends unknown> {
    onView?: (row: TData) => void;
    onActivate?: (row: TData) => void;
    onDeactivate?: (row: TData) => void;
  }
}
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, CheckCircle2, XCircle } from 'lucide-react';
import { Subscriber } from './types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

// Formatação de documento (CPF/CNPJ)
const formatDocument = (doc: string) => {
  if (!doc) return '';
  doc = doc.replace(/\D/g, '');
  
  if (doc.length === 11) {
    return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else if (doc.length === 14) {
    return doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  return doc;
};

export const columns: ColumnDef<Subscriber>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "document",
    header: "CPF/CNPJ",
    cell: ({ row }) => {
      const document = row.getValue("document") as string;
      return <span>{formatDocument(document)}</span>;
    },
  },
  {
    accessorKey: "segment_name",
    header: "Segmento",
    cell: ({ row }) => {
      const segmentName = row.getValue("segment_name") as string;
      return segmentName || "N/A";
    }
  },
  {
    accessorKey: "plan_name",
    header: "Plano",
    cell: ({ row }) => {
      const planName = row.getValue("plan_name") as string;
      return planName || "N/A";
    }
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("is_active") as boolean;
      return (
        <Badge variant={isActive ? "outline" : "destructive"} className={isActive ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>
          {isActive ? "Ativo" : "Inativo"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Data de Criação",
    cell: ({ row }) => {
      const createdAt = row.getValue("created_at") as string;
      if (!createdAt) return "N/A";
      
      try {
        const date = new Date(createdAt);
        return format(date, "dd/MM/yyyy", { locale: ptBR });
      } catch (error) {
        return createdAt;
      }
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const subscriber = row.original;
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => table.options.meta?.onView?.(subscriber)}
            >
              <Eye className="mr-2 h-4 w-4" /> Ver detalhes
            </DropdownMenuItem>
            
            {subscriber.is_active ? (
              <DropdownMenuItem 
                onClick={() => table.options.meta?.onDeactivate?.(subscriber)}
                className="text-destructive focus:text-destructive"
              >
                <XCircle className="mr-2 h-4 w-4" /> Desativar
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem 
                onClick={() => table.options.meta?.onActivate?.(subscriber)}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" /> Ativar
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];