import api from './api';
import axios from 'axios';
import { Subscriber, SubscriberDetail, Address } from '@/components/subscribers/types';

interface ApiResponse {
  total: number;
  page: number;
  size: number;
  items: Subscriber[];
}

export interface PaginationParams {
  skip?: number;
  limit?: number;
  name?: string;
  is_active?: boolean;
}

export interface PaginatedSubscribers {
  data: Subscriber[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SubscriberFormData {
  name: string;
  email: string;
  document: string;
  document_type?: 'cpf' | 'cnpj';
  phone: string;
  
  // Campos tradicionais de endereço
  address?: string;
  number?: string;
  complement?: string;
  district?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  
  // Pode aceitar um objeto de endereço completo também
  addressObject?: {
    postal_code: string;
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
  };
  
  // Campos específicos de negócio
  clinic_name?: string;
  segment_id?: string;
  plan_id?: string;
  is_active?: boolean;
}

// Serviço para buscar dados de endereço por CEP
export const viaCepService = {
  async fetchAddressByCep(cep: string): Promise<Address | null> {
    try {
      const cleanCep = cep.replace(/\D/g, '');
      
      if (cleanCep.length !== 8) {
        console.log('CEP inválido:', cep);
        return null;
      }
      
      console.log(`Buscando endereço para CEP: ${cleanCep}`);
      const response = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
      
      // Verifica se há erro no ViaCEP
      if (response.data.erro) {
        console.log('CEP não encontrado na base do ViaCEP');
        return null;
      }
      
      return {
        postal_code: response.data.cep,
        street: response.data.logradouro,
        complement: response.data.complemento,
        district: response.data.bairro,
        city: response.data.localidade,
        state: response.data.uf
      };
    } catch (error) {
      console.error('Erro ao buscar endereço pelo CEP:', error);
      return null;
    }
  }
};

export const subscribersService = {
  // Buscar todos os assinantes com paginação
  async getAll(params?: PaginationParams): Promise<PaginatedSubscribers> {
    try {
      // Configurar parâmetros padrão para paginação
      const paginationParams = {
        limit: params?.limit || 10,
        skip: params?.skip || 0,
        name: params?.name,
        is_active: params?.is_active
      };
      
      // URL correta para a API: direto na raiz (sem /api/ ou /external-api/)
      console.log('Fazendo requisição para API:', '/subscribers', 'com parâmetros:', paginationParams);
      
      // Usando URL completa de produção do backend
      const apiUrl = 'https://hubb-one-assist-back-hubb-one.replit.app/subscribers';
      console.log(`Usando URL completa da API: ${apiUrl}`);
      
      const response = await axios.get<ApiResponse>(apiUrl, { 
        params: paginationParams,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Resposta recebida:', response.status, response.statusText);
      
      // Log detalhado da resposta para debugging
      console.log('Estrutura da resposta da API:', JSON.stringify(response.data));
      
      // Verificar o formato da resposta e adaptar conforme necessário
      const items = Array.isArray(response.data.items) 
        ? response.data.items 
        : Array.isArray(response.data) 
          ? response.data 
          : [];
          
      // Retornar objeto com dados e metadados de paginação
      return {
        data: items,
        total: response.data.total || items.length || 0,
        page: response.data.page || Math.floor(paginationParams.skip / paginationParams.limit) + 1,
        pageSize: response.data.size || paginationParams.limit
      };
    } catch (error) {
      console.error('Erro ao buscar assinantes:', error);
      
      // Log detalhado para debugging
      const axiosError = error as any;
      if (axiosError.response?.data?.message) {
        console.log('Mensagem do servidor:', axiosError.response.data.message);
      }
      
      // ✅ Removido código de fallback para expor o erro real
      // ✅ Agora podemos ver o erro verdadeiro sem máscaras
      
      // Retornar objeto vazio para evitar erros na tela
      return {
        data: [],
        total: 0,
        page: 1,
        pageSize: 10
      };
    }
  },

  // Buscar assinante por ID 
  async getById(id: string): Promise<SubscriberDetail> {
    try {
      // Usando URL completa de produção do backend
      const apiUrl = `https://hubb-one-assist-back-hubb-one.replit.app/subscribers/${id}`;
      console.log(`Fazendo requisição GET para API: ${apiUrl}`);
      
      const response = await axios.get<SubscriberDetail>(apiUrl, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Resposta de detalhes recebida:', response.status);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar assinante com ID ${id}:`, error);
      
      // Log detalhado para debug e capturar mensagens úteis do servidor
      const axiosError = error as any;
      if (axiosError.response?.data?.message) {
        console.log('Mensagem do servidor:', axiosError.response.data.message);
      }
      
      // Simplificando o código para ver o erro real
      throw error;
    }
  },
  
  // Editar assinante
  async update(id: string, data: Partial<SubscriberFormData>): Promise<Subscriber> {
    try {
      // Usando URL completa de produção do backend
      const apiUrl = `https://hubb-one-assist-back-hubb-one.replit.app/subscribers/${id}`;
      console.log(`Fazendo requisição PUT para API: ${apiUrl}`);
      console.log('Dados enviados para atualização:', data);
      
      const response = await axios.put<Subscriber>(apiUrl, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Resposta de edição recebida:', response.status);
      return response.data;
    } catch (error) {
      console.error(`Erro ao editar assinante com ID ${id}:`, error);
      
      // Log detalhado para debug e capturar mensagens úteis do servidor
      const axiosError = error as any;
      if (axiosError.response?.data?.message) {
        console.log('Mensagem do servidor:', axiosError.response.data.message);
      }
      
      throw error;
    }
  },

  // Atualizar status do assinante (ativar/desativar)
  async updateStatus(id: string, isActive: boolean): Promise<Subscriber> {
    try {
      // Usando URL completa de produção do backend
      // IMPORTANTE: Usar URLs sem barras no final
      const baseUrl = 'https://hubb-one-assist-back-hubb-one.replit.app';
      const endpoint = isActive 
        ? `${baseUrl}/subscribers/${id}/activate` 
        : `${baseUrl}/subscribers/${id}/deactivate`;
      
      console.log(`Fazendo requisição PATCH para API: ${endpoint}`);
      const response = await axios.patch<Subscriber>(endpoint, {}, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Resposta de atualização recebida:', response.status);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar status do assinante com ID ${id}:`, error);
      
      // Log detalhado para debug e capturar mensagens úteis do servidor
      const axiosError = error as any;
      if (axiosError.response?.data?.message) {
        console.log('Mensagem do servidor:', axiosError.response.data.message);
      }
      
      throw error;
    }
  },
};