import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Segment } from "./types";

// Função para ordernar por coluna
function sortableHeader(column: string, header: string) {
  return {
    accessorKey: column,
    header: ({ column }: { column: any }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="pl-0"
      >
        {header}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  };
}

export const columns: ColumnDef<Segment>[] = [
  // Coluna: ID
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="text-sm text-muted-foreground">{row.getValue("id")}</div>,
  },
  
  // Coluna: Nome (com ordenação)
  sortableHeader("name", "Nome"),
  
  // Coluna: Descrição
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      if (!description) return <span className="text-muted-foreground text-sm italic">Sem descrição</span>;
      return <div className="max-w-[400px] truncate">{description}</div>;
    },
  },
  
  // Coluna: Status 
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const is_active = row.getValue("is_active") as boolean;
      return (
        <Badge variant={is_active ? "default" : "outline"}>
          {is_active ? "Ativo" : "Inativo"}
        </Badge>
      );
    },
  },
  
  // Coluna: Ativar/Desativar
  {
    id: "ativar",
    header: "Ativar/Desativar",
    cell: ({ row, table }) => {
      const { updateSegmentStatus } = table.options.meta as { 
        updateSegmentStatus: (id: string, status: boolean) => void 
      };
      
      const segment = row.original;
      const is_active = row.getValue("is_active") as boolean;
      
      return (
        <Switch
          checked={is_active}
          onCheckedChange={(checked) => updateSegmentStatus(segment.id, checked)}
        />
      );
    },
  },
  
  // Coluna: Ações
  {
    id: "actions",
    header: "Ações",
    cell: ({ row, table }) => {
      const segment = row.original;
      const { onEdit, onDelete } = table.options.meta as { 
        onEdit: (segment: Segment) => void;
        onDelete: (segment: Segment) => void;
      };
      
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(segment)}
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Editar</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(segment)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash className="h-4 w-4" />
            <span className="sr-only">Excluir</span>
          </Button>
        </div>
      );
    },
  },
];