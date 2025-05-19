import { toast } from "sonner";
import {
  createPatient,
  updatePatient,
  getPatients,
  deletePatient,
  getPatient,
  activatePatient,
  deactivatePatient
} from "./api";
import { PatientFormData, Patient } from "./types";

export function useCreatePatient() {
  const handleCreate = async (data: PatientFormData) => {
    try {
      const result = await createPatient(data);
      toast.success("Paciente criado com sucesso!");
      return result;
    } catch (err: any) {
      const message = err.response?.data?.message || "Erro ao criar paciente";
      toast.error(message);
      throw err;
    }
  };

  return { handleCreate };
}

export function useUpdatePatient() {
  const handleUpdate = async (id: string, data: PatientFormData) => {
    try {
      const result = await updatePatient(id, data);
      toast.success("Paciente atualizado com sucesso!");
      return result;
    } catch (err: any) {
      const message = err.response?.data?.message || "Erro ao atualizar paciente";
      toast.error(message);
      throw err;
    }
  };

  return { handleUpdate };
}

export function useDeletePatient() {
  const handleDelete = async (id: string) => {
    try {
      await deletePatient(id);
      toast.success("Paciente excluído com sucesso!");
      return true;
    } catch (err: any) {
      const message = err.response?.data?.message || "Erro ao excluir paciente";
      toast.error(message);
      throw err;
    }
  };

  return { handleDelete };
}

export function useListPatients() {
  const fetch = async (params?: { skip?: number; limit?: number }) => {
    try {
      return await getPatients(params);
    } catch (err: any) {
      const message = err.response?.data?.message || "Erro ao buscar pacientes";
      toast.error(message);
      return [];
    }
  };

  return { fetch };
}

export function useGetPatient() {
  const fetchById = async (id: string) => {
    try {
      return await getPatient(id);
    } catch (err: any) {
      const message = err.response?.data?.message || "Erro ao buscar paciente";
      toast.error(message);
      throw err;
    }
  };

  return { fetchById };
}

export function usePatientStatus() {
  const handleActivate = async (id: string) => {
    try {
      const result = await activatePatient(id);
      toast.success("Paciente ativado com sucesso!");
      return result;
    } catch (err: any) {
      const message = err.response?.data?.message || "Erro ao ativar paciente";
      toast.error(message);
      throw err;
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      const result = await deactivatePatient(id);
      toast.success("Paciente desativado com sucesso!");
      return result;
    } catch (err: any) {
      const message = err.response?.data?.message || "Erro ao desativar paciente";
      toast.error(message);
      throw err;
    }
  };

  return { handleActivate, handleDeactivate };
}