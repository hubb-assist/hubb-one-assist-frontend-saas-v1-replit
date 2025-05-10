import axios from 'axios';
import { SystemUser, SystemUserCreateValues, SystemUserUpdateValues } from '@/components/system-users/types';
import { API_CONFIG } from './config';

// Importando configuração centralizada
const { ENDPOINTS, BASE_URL, TIMEOUT } = API_CONFIG;

// Configuração específica para usuários do sistema
const systemUsersApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: TIMEOUT
});

// Adicionar interceptors para debug e controle de erros
systemUsersApi.interceptors.request.use(config => {
  // Log da URL final
  const baseURL = config.baseURL || '';
  const url = config.url || '';
  console.log('Requisição de usuários do sistema para:', baseURL + url);
  return config;
});

systemUsersApi.interceptors.response.use(
  response => {
    console.log('STATUS:', response.status);
    console.log('HEADERS:', response.headers);
    return response;
  },
  error => {
    console.error('Erro na requisição de usuários do sistema:', error);
    return Promise.reject(error);
  }
);

// Interface da resposta da API paginada
interface ApiResponse {
  total: number;
  page: number;
  size: number;
  items: SystemUser[];
}

// API de Usuários do Sistema
export const systemUsersService = {
  // Listar todos os usuários do sistema
  async getAll(params?: { skip?: number; limit?: number; name?: string; email?: string; role?: string; is_active?: boolean }): Promise<SystemUser[]> {
    try {
      const path = ENDPOINTS.SYSTEM_USERS;
      console.log('Buscando usuários do sistema na API:', path, 'com params:', params);
      
      const response = await systemUsersApi.get(path, { params });
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
      console.error('Erro ao buscar usuários do sistema:', error);
      // Vamos retornar um array vazio em vez de lançar o erro, para evitar loops
      return [];
    }
  },

  // Buscar usuário do sistema por ID
  async getById(id: string): Promise<SystemUser> {
    try {
      const response = await systemUsersApi.get(`${ENDPOINTS.SYSTEM_USERS}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar usuário do sistema com ID ${id}:`, error);
      throw error;
    }
  },

  // Criar novo usuário do sistema
  async create(data: SystemUserCreateValues): Promise<SystemUser> {
    try {
      const response = await systemUsersApi.post(ENDPOINTS.SYSTEM_USERS, data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao criar usuário do sistema:', error);
      throw error;
    }
  },

  // Atualizar usuário do sistema existente
  async update(id: string, data: SystemUserUpdateValues): Promise<SystemUser> {
    try {
      const response = await systemUsersApi.put(`${ENDPOINTS.SYSTEM_USERS}/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao atualizar usuário do sistema com ID ${id}:`, error);
      throw error;
    }
  },

  // Excluir usuário do sistema
  async delete(id: string): Promise<void> {
    try {
      const path = `${ENDPOINTS.SYSTEM_USERS}/${id}`;
      console.log(`Excluindo usuário do sistema na API: ${path}`);
      await systemUsersApi.delete(path);
    } catch (error) {
      console.error(`Erro ao excluir usuário do sistema ${id}:`, error);
      throw error;
    }
  },

  // Ativar usuário do sistema
  async activate(id: string): Promise<SystemUser> {
    try {
      const endpoint = `${ENDPOINTS.SYSTEM_USERS}/${id}/activate`;
      const response = await systemUsersApi.patch(endpoint, {});
      return response.data;
    } catch (error) {
      console.error(`Erro ao ativar usuário do sistema com ID ${id}:`, error);
      throw error;
    }
  },

  // Desativar usuário do sistema
  async deactivate(id: string): Promise<SystemUser> {
    try {
      const endpoint = `${ENDPOINTS.SYSTEM_USERS}/${id}/deactivate`;
      const response = await systemUsersApi.patch(endpoint, {});
      return response.data;
    } catch (error) {
      console.error(`Erro ao desativar usuário do sistema com ID ${id}:`, error);
      throw error;
    }
  }
};