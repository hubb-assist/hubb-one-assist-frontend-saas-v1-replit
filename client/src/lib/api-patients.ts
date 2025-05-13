import api from './api';
import axios from 'axios';
import { Patient, PatientFormData, PaginationParams, PaginatedPatients } from '@/components/patients/types';

// URL base para a API
const baseUrl = 'https://hubb-one-assist-back-hubb-one.replit.app';

interface ApiResponse {
  total: number;
  page: number;
  size: number;
  items: Patient[];
}

export const patientsService = {
  // Buscar todos os pacientes com paginação
  async getAll(params?: PaginationParams): Promise<PaginatedPatients> {
    try {
      // Configurar parâmetros padrão para paginação
      const paginationParams = {
        limit: params?.limit || 10,
        skip: params?.skip || 0,
        name: params?.name,
        is_active: params?.is_active,
        _t: Date.now() // Evitar cache
      };
      
      console.log('Buscando pacientes com parâmetros:', paginationParams);
      
      const response = await axios.get<ApiResponse>(`${baseUrl}/patients`, { 
        params: paginationParams,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Resposta recebida:', response.status);
      
      // Verificar o formato da resposta e adaptar conforme necessário
      const items = Array.isArray(response.data.items) 
        ? response.data.items 
        : Array.isArray(response.data) 
          ? response.data 
          : [];
          
      return {
        data: items,
        total: response.data.total || items.length || 0,
        page: response.data.page || Math.floor(paginationParams.skip / paginationParams.limit) + 1,
        pageSize: response.data.size || paginationParams.limit
      };
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      throw error;
    }
  },

  // Buscar paciente por ID 
  async getById(id: string): Promise<Patient> {
    try {
      console.log(`Buscando paciente com ID ${id}`);
      
      const response = await axios.get<Patient>(`${baseUrl}/patients/${id}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Resposta recebida:', response.status);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar paciente com ID ${id}:`, error);
      throw error;
    }
  },
  
  // Criar novo paciente
  async create(data: PatientFormData): Promise<Patient> {
    try {
      console.log('Criando novo paciente com dados:', data);
      
      const response = await axios.post<Patient>(`${baseUrl}/patients`, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Resposta recebida:', response.status);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar paciente:', error);
      throw error;
    }
  },
  
  // Editar paciente
  async update(id: string, data: Partial<PatientFormData>): Promise<Patient> {
    try {
      console.log(`Atualizando paciente com ID ${id}`, data);
      
      const response = await axios.put<Patient>(`${baseUrl}/patients/${id}`, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Resposta recebida:', response.status);
      return response.data;
    } catch (error) {
      console.error(`Erro ao editar paciente com ID ${id}:`, error);
      throw error;
    }
  },

  // Excluir paciente
  async delete(id: string): Promise<boolean> {
    try {
      console.log(`Excluindo paciente com ID ${id}`);
      
      const response = await axios.delete(`${baseUrl}/patients/${id}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Resposta recebida:', response.status);
      return response.status === 204 || (response.status >= 200 && response.status < 300);
    } catch (error) {
      console.error(`Erro ao excluir paciente com ID ${id}:`, error);
      throw error;
    }
  },

  // Atualizar status do paciente (ativar/desativar)
  async updateStatus(id: string, isActive: boolean): Promise<Patient> {
    try {
      const endpoint = isActive 
        ? `${baseUrl}/patients/${id}/activate` 
        : `${baseUrl}/patients/${id}/deactivate`;
      
      console.log(`Atualizando status do paciente com ID ${id} para ${isActive ? 'ativo' : 'inativo'}`);
      
      const response = await axios.patch<Patient>(endpoint, {}, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Resposta recebida:', response.status);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar status do paciente com ID ${id}:`, error);
      throw error;
    }
  },
};