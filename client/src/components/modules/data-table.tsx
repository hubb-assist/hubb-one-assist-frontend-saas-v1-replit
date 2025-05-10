import React, { useState } from 'react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable, SortingState, getSortedRowModel, getPaginationRowModel, ColumnFiltersState, getFilteredRowModel, Row } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Module } from './types';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  onEdit: (module: Module) => void;
  onDelete: (module: Module) => void;
  updateModuleStatus: (id: string, status: boolean) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  onEdit,
  onDelete,
  updateModuleStatus
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

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
    meta: {
      updateModuleStatus: (id: string, status: boolean) => {
        updateModuleStatus(id, status);
      },
    },
  });

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
      const module = row.original as Module;
      updateModuleStatus(module.id, checked);
    };
    
    return extendedRow;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Filtrar por nome..."
          value={(table.getColumn('nome')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('nome')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
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
                  {isLoading ? 'Carregando...' : 'Nenhum módulo encontrado.'}
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