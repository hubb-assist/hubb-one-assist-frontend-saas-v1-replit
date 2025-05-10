import api from './api';
import axios from 'axios';
import { Module, ModuleFormValues } from '@/components/modules/types';
import { API_CONFIG } from './config';

// Importando configuração centralizada
const { ENDPOINTS, BASE_URL } = API_CONFIG;

// Configuração específica para módulos
const modulesApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000
});

// Adicionar interceptors para debug e controle de erros
modulesApi.interceptors.request.use(config => {
  // Log da URL final
  console.log('Requisição de módulos para:', config.baseURL + config.url);
  return config;
});

modulesApi.interceptors.response.use(
  response => response,
  error => {
    console.error('Erro na requisição de módulos:', error);
    return Promise.reject(error);
  }
);

// Interface da resposta da API
interface ApiResponse {
  total: number;
  page: number;
  size: number;
  items: Module[];
}

// API de Módulos
export const modulesService = {
  // Listar todos os módulos
  async getAll(params?: { skip?: number; limit?: number; name?: string; is_active?: boolean }): Promise<Module[]> {
    try {
      const path = ENDPOINTS.MODULES;
      console.log('Buscando módulos na API:', path, 'com params:', params);
      
      const response = await modulesApi.get(path, { params });
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
      console.error('Erro ao buscar módulos:', error);
      // Vamos retornar um array vazio em vez de lançar o erro, para evitar loops
      return [];
    }
  },

  // Buscar um módulo por ID
  async getById(id: string): Promise<Module> {
    try {
      const path = `${ENDPOINTS.MODULES}/${id}`;
      console.log(`Buscando módulo na API: ${path}`);
      
      const response = await modulesApi.get(path);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar módulo ${id}:`, error);
      throw error;
    }
  },

  // Criar um novo módulo
  async create(data: ModuleFormValues): Promise<Module> {
    try {
      // Adaptando para os nomes de campo que a API espera (em português)
      const apiData = {
        nome: data.name,
        descricao: data.description || null,
        is_active: data.is_active
      };
      
      const path = ENDPOINTS.MODULES;
      console.log(`Criando módulo na API: ${path}`);
      console.log('Dados enviados para API:', apiData);
      
      const response = await modulesApi.post(path, apiData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar módulo:', error);
      throw error;
    }
  },

  // Atualizar um módulo existente
  async update(id: string, data: ModuleFormValues): Promise<Module> {
    try {
      // Adaptando para os nomes de campo que a API espera (em português)
      const apiData = {
        nome: data.name,
        descricao: data.description || null,
        is_active: data.is_active
      };
      
      const path = `${ENDPOINTS.MODULES}/${id}`;
      console.log(`Atualizando módulo na API: ${path}`);
      console.log('Dados enviados para API:', apiData);
      
      const response = await modulesApi.put(path, apiData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar módulo ${id}:`, error);
      throw error;
    }
  },

  // Excluir um módulo
  async delete(id: string): Promise<void> {
    try {
      const path = `${ENDPOINTS.MODULES}/${id}`;
      console.log(`Excluindo módulo na API: ${path}`);
      await modulesApi.delete(path);
    } catch (error) {
      console.error(`Erro ao excluir módulo ${id}:`, error);
      throw error;
    }
  },

  // Atualizar apenas o status de um módulo (ativo/inativo)
  async updateStatus(id: string, isActive: boolean): Promise<Module> {
    try {
      // Usar rotas específicas para ativar/desativar sem barra no final
      const path = isActive 
        ? `${ENDPOINTS.MODULES}/${id}/activate` 
        : `${ENDPOINTS.MODULES}/${id}/deactivate`;
      
      console.log(`Atualizando status do módulo ${id} para ${isActive ? 'ativo' : 'inativo'} na API: ${path}`);
      
      const response = await modulesApi.patch(path);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar status do módulo ${id}:`, error);
      throw error;
    }
  }
};