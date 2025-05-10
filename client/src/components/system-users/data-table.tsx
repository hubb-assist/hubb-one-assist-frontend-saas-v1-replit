import React, { useState } from 'react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable, SortingState, getSortedRowModel, getPaginationRowModel, ColumnFiltersState, getFilteredRowModel, Row } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SystemUser, SystemUserRole, roleLabels } from './types';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  onEdit: (user: SystemUser) => void;
  onDelete: (user: SystemUser) => void;
  onUpdateStatus: (id: string, status: boolean) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  onEdit,
  onDelete,
  onUpdateStatus
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [roleFilter, setRoleFilter] = useState<string[]>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex: 0,
        pageSize: rowsPerPage,
      },
    },
  });

  // Aplicar filtro de cargo/role
  React.useEffect(() => {
    if (roleFilter.length > 0) {
      table.getColumn('role')?.setFilterValue(roleFilter);
    } else {
      table.getColumn('role')?.setFilterValue(undefined);
    }
  }, [roleFilter, table]);

  // Setando as ações nas linhas
  const rows = table.getRowModel().rows.map(row => {
    // Estender a row com as propriedades customizadas
    const extendedRow = row as Row<TData> & {
      onEdit: typeof onEdit;
      onDelete: typeof onDelete;
      onStatusChange: (checked: boolean) => void;
    };
    
    extendedRow.onEdit = onEdit;
    extendedRow.onDelete = onDelete;
    extendedRow.onStatusChange = (checked: boolean) => {
      const user = row.original as SystemUser;
      onUpdateStatus(user.id, checked);
    };
    
    return extendedRow;
  });

  // Função para lidar com a mudança no filtro de cargo
  const handleRoleFilterChange = (value: string) => {
    if (value === 'all') {
      setRoleFilter([]);
    } else {
      setRoleFilter([value]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center py-4 gap-2">
        <Input
          placeholder="Filtrar por nome..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        
        <Select
          value={roleFilter.length ? roleFilter[0] : 'all'}
          onValueChange={handleRoleFilterChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por cargo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os cargos</SelectItem>
            {Object.entries(roleLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {isLoading ? 'Carregando...' : 'Nenhum usuário encontrado.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            Mostrando página {table.getState().pagination.pageIndex + 1} de{' '}
            {table.getPageCount()} ({data.length} itens)
          </p>
          
          <Select
            value={`${rowsPerPage}`}
            onValueChange={(value) => {
              setRowsPerPage(Number(value));
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={rowsPerPage} />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  );
}