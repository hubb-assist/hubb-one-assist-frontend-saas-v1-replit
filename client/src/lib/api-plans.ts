import api from './api';
import axios from 'axios';
import { Plan, PlanFormValues } from '@/components/plans/types';
import { API_CONFIG } from './config';

// Importando configuração centralizada
const { ENDPOINTS, BASE_URL } = API_CONFIG;

// Configuração específica para planos
const plansApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000
});

// Adicionar interceptors para debug e controle de erros
plansApi.interceptors.request.use(config => {
  // Log da URL final
  const baseURL = config.baseURL || '';
  const url = config.url || '';
  console.log('Requisição de planos para:', baseURL + url);
  return config;
});

plansApi.interceptors.response.use(
  response => response,
  error => {
    console.error('Erro na requisição de planos:', error);
    return Promise.reject(error);
  }
);

// Interface da resposta da API
interface ApiResponse {
  total: number;
  page: number;
  size: number;
  items: Plan[];
}

// API de Planos
export const plansService = {
  // Listar todos os planos
  async getAll(params?: { skip?: number; limit?: number; name?: string; is_active?: boolean }): Promise<Plan[]> {
    try {
      const path = ENDPOINTS.PLANS;
      console.log('Buscando planos na API:', path, 'com params:', params);
      
      const response = await plansApi.get(path, { params });
      console.log('STATUS:', response.status);
      console.log('HEADERS:', response.headers);
      console.log('Resposta da API:', response.data);
      
      // A resposta da API tem um formato específico com a lista em 'items'
      const apiResponse = response.data as ApiResponse;
      
      if (!apiResponse?.items) {
        console.warn('A resposta da API não contém o campo "items":', apiResponse);
        return [];
      }
      
      // Retornar apenas o array de itens
      return apiResponse.items;
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
      // Vamos retornar um array vazio em vez de lançar o erro, para evitar loops
      return [];
    }
  },

  // Buscar plano por ID
  async getById(id: string): Promise<Plan> {
    try {
      const response = await plansApi.get(`${ENDPOINTS.PLANS}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar plano com ID ${id}:`, error);
      throw error;
    }
  },

  // Criar novo plano
  async create(data: PlanFormValues): Promise<Plan> {
    try {
      // Converter dados para o formato esperado pela API
      const apiData: any = {
        name: data.name,
        segment_id: data.segment_id,
        base_price: data.base_price,
        description: data.description,
        is_active: data.is_active,
      };
      
      // Adicionar módulos apenas se houver algum selecionado
      if (data.modules && data.modules.length > 0) {
        apiData.modules = data.modules.map(m => ({
          module_id: m.module_id,
          price: m.is_free ? 0 : (m.custom_price || 0),
          is_free: m.is_free === true,
          trial_days: m.trial_days || 0
        }));
      } else {
        // Enviar um array vazio de módulos quando não houver módulos selecionados
        apiData.modules = [];
        console.log('Criando plano sem módulos:', apiData);
      }
      
      const response = await plansApi.post(ENDPOINTS.PLANS, apiData);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao criar plano:', error);
      throw error;
    }
  },

  // Atualizar plano existente
  async update(id: string, data: PlanFormValues): Promise<Plan> {
    try {
      // Converter dados para o formato esperado pela API
      const apiData = {
        name: data.name,
        segment_id: data.segment_id,
        base_price: data.base_price, 
        description: data.description,
        is_active: data.is_active,
      };
      
      // Adicionar módulos apenas se houver algum selecionado
      if (data.modules && data.modules.length > 0) {
        apiData['modules'] = data.modules.map(m => ({
          module_id: m.module_id,
          price: m.is_free ? 0 : (m.custom_price || 0),
          is_free: m.is_free === true,
          trial_days: m.trial_days || 0
        }));
      } else {
        // Enviar um array vazio de módulos quando não houver módulos selecionados
        apiData['modules'] = [];
        console.log('Atualizando plano sem módulos:', apiData);
      }
      
      const response = await plansApi.put(`${ENDPOINTS.PLANS}/${id}`, apiData);
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao atualizar plano com ID ${id}:`, error);
      throw error;
    }
  },

  // Excluir plano
  async delete(id: string): Promise<void> {
    try {
      const path = `${ENDPOINTS.PLANS}/${id}`;
      console.log(`Excluindo plano na API: ${path}`);
      await api.delete(path);
    } catch (error) {
      console.error(`Erro ao excluir plano ${id}:`, error);
      throw error;
    }
  },

  // Atualizar status de ativação do plano
  async updateStatus(id: string, isActive: boolean): Promise<Plan> {
    try {
      const endpoint = isActive 
        ? `${ENDPOINTS.PLANS}/${id}/activate` 
        : `${ENDPOINTS.PLANS}/${id}/deactivate`;
        
      const response = await plansApi.patch(endpoint, {});
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar status do plano com ID ${id}:`, error);
      throw error;
    }
  }
};