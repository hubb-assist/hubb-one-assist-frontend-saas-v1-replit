import { useEffect, useState } from "react";
import { useListPatients, useDeletePatient, usePatientStatus } from "@/domain/patient/useCases";
import { Patient } from "@/domain/patient/types";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { 
  Edit, 
  Trash2, 
  Plus, 
  RefreshCcw,
  EyeIcon,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

interface PatientListProps {
  onAddClick?: () => void;
  onEditClick?: (patient: Patient) => void;
  onViewClick?: (patient: Patient) => void;
}

export function PatientList({ onAddClick, onEditClick, onViewClick }: PatientListProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const { fetch } = useListPatients();
  const { handleDelete } = useDeletePatient();
  const { handleActivate, handleDeactivate } = usePatientStatus();

  const loadPatients = async () => {
    setLoading(true);
    try {
      const result = await fetch();
      setPatients(result);
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const onDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este paciente?")) {
      try {
        await handleDelete(id);
        setPatients((prev) => prev.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Erro ao excluir paciente:", error);
      }
    }
  };

  const toggleStatus = async (patient: Patient) => {
    try {
      if (patient.is_active) {
        const updated = await handleDeactivate(patient.id);
        setPatients(prev => 
          prev.map(p => p.id === patient.id ? updated : p)
        );
      } else {
        const updated = await handleActivate(patient.id);
        setPatients(prev => 
          prev.map(p => p.id === patient.id ? updated : p)
        );
      }
    } catch (error) {
      console.error("Erro ao alterar status do paciente:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Pacientes</CardTitle>
          <CardDescription>
            Gerenciamento de pacientes
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={loadPatients}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          {onAddClick ? (
            <Button size="sm" onClick={onAddClick}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Paciente
            </Button>
          ) : (
            <Button size="sm" asChild>
              <Link href="/clinica/patients/create">
                <Plus className="h-4 w-4 mr-2" />
                Novo Paciente
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="w-full py-10 text-center">Carregando pacientes...</div>
        ) : patients.length === 0 ? (
          <div className="w-full py-10 text-center">
            <p className="text-muted-foreground">Nenhum paciente cadastrado.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Nascimento</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.cpf}</TableCell>
                  <TableCell>{formatDate(patient.birth_date)}</TableCell>
                  <TableCell>{patient.phone || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={patient.is_active ? "success" : "destructive"}>
                      {patient.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => toggleStatus(patient)}
                        title={patient.is_active ? "Desativar" : "Ativar"}
                      >
                        {patient.is_active ? (
                          <ToggleRight className="h-4 w-4" />
                        ) : (
                          <ToggleLeft className="h-4 w-4" />
                        )}
                      </Button>
                      
                      {onViewClick && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onViewClick(patient)}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {onEditClick ? (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onEditClick(patient)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/clinica/patients/${patient.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onDelete(patient.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}