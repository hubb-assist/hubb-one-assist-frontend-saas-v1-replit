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
      
      console.log('Fazendo requisição para API:', '/external-api/subscribers', 'com parâmetros:', paginationParams);
      // Usando o proxy local que foi configurado pelo backend
      const response = await axios.get<ApiResponse>('/external-api/subscribers', { 
        params: paginationParams,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Resposta recebida:', response.status, response.statusText);
      
      // Retornar objeto com dados e metadados de paginação
      return {
        data: response.data.items,
        total: response.data.total,
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
      
      try {
        // Tentar o endpoint de fallback caso a API principal falhe
        console.log('Tentando endpoint fallback');
        const fallbackResponse = await api.get<ApiResponse>('/api/subscribers/fallback');
        console.log('Usando dados de fallback');
        
        // Retornar também a estrutura de paginação para o fallback
        return {
          data: fallbackResponse.data.items,
          total: fallbackResponse.data.total || fallbackResponse.data.items.length,
          page: 1,
          pageSize: fallbackResponse.data.items.length
        };
      } catch (fallbackError) {
        console.error('Erro ao usar endpoint fallback:', fallbackError);
      }
      
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
      // Tentar usar o proxy local configurado pelo backend
      console.log(`Fazendo requisição GET para API: /external-api/subscribers/${id}`);
      
      try {
        const response = await axios.get<SubscriberDetail>(`/external-api/subscribers/${id}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        console.log('Resposta de detalhes recebida:', response.status);
        return response.data;
      } catch (directError) {
        console.error(`Erro ao buscar assinante diretamente. Tentando abordagem alternativa...`, directError);
        
        // Plano B: buscar via listagem completa
        console.log(`Buscando assinante ${id} pela listagem completa`);
        
        const response = await this.getAll({ limit: 100 }); // Pegar um limite grande para garantir
        const subscribers = response.data;
        
        // Encontrar o assinante pelo ID
        const subscriber = subscribers.find(s => s.id === id);
        
        if (!subscriber) {
          throw new Error(`Assinante com ID ${id} não encontrado`);
        }
        
        console.log('Assinante encontrado na listagem:', subscriber);
        
        // Converter para o formato SubscriberDetail
        const subscriberDetail: SubscriberDetail = {
          ...subscriber as any,
        };
        
        return subscriberDetail;
      }
    } catch (error) {
      console.error(`Erro ao buscar assinante com ID ${id}:`, error);
      
      // Log detalhado para debug e capturar mensagens úteis do servidor
      const axiosError = error as any;
      if (axiosError.response?.data?.message) {
        console.log('Mensagem do servidor:', axiosError.response.data.message);
      }
      
      throw error;
    }
  },
  
  // Editar assinante
  async update(id: string, data: Partial<SubscriberFormData>): Promise<Subscriber> {
    try {
      // Usar o endpoint correto com o proxy local
      console.log(`Fazendo requisição PUT para API: /external-api/subscribers/${id}`);
      console.log('Dados enviados para atualização:', data);
      
      const response = await axios.put<Subscriber>(`/external-api/subscribers/${id}`, data, {
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
      // IMPORTANTE: Usar URLs sem barras no final
      const endpoint = isActive 
        ? `/external-api/subscribers/${id}/activate` 
        : `/external-api/subscribers/${id}/deactivate`;
      
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