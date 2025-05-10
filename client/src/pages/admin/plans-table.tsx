import React from 'react';
import { Plan } from '@/components/plans/types';
import { ActionButtons } from '@/components/plans/action-buttons';
import { StatusSwitch } from '@/components/plans/status-switch';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '@/lib/utils';

interface PlansTableProps {
  plans: Plan[];
  onEdit: (plan: Plan) => void;
  onDelete: (plan: Plan) => void;
  onUpdateStatus: (id: string, isActive: boolean) => void;
}

export function PlansTable({ plans, onEdit, onDelete, onUpdateStatus }: PlansTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Segmento</TableHead>
            <TableHead>Preço Base</TableHead>
            <TableHead>Módulos</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criado</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Nenhum plano encontrado.
              </TableCell>
            </TableRow>
          ) : (
            plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">
                  {plan.name}
                </TableCell>
                <TableCell>{plan.segment?.nome || ''}</TableCell>
                <TableCell>{formatCurrency(plan.base_price)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="px-2 py-1 text-xs font-normal">
                    {plan.modules?.length || 0} módulos
                  </Badge>
                </TableCell>
                <TableCell>
                  <StatusSwitch
                    plan={plan}
                    onUpdateStatus={onUpdateStatus}
                  />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(plan.created_at), { addSuffix: true, locale: ptBR })}
                </TableCell>
                <TableCell>
                  <ActionButtons
                    plan={plan}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}