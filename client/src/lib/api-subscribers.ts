import api from './api';
import axios from 'axios';
import { Subscriber, SubscriberDetail, Address } from '@/components/subscribers/types';

interface ApiResponse {
  total: number;
  page: number;
  size: number;
  items: Subscriber[];
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
  
  // Campos para tipo clínica
  clinic_name?: string;
  
  // Campos de assinatura
  segment_id: string;
  plan_id: string;
  password: string;
  
  // Informações de admin (pode ser separado ou incorporado)
  admin_user?: {
    name: string;
    email: string;
    password: string;
  };
  admin_password?: string;
}

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

// Serviço para busca de endereço pelo CEP
export const viaCepService = {
  async getAddressByCep(cep: string): Promise<Address | null> {
    try {
      // Remover qualquer caracter não numérico
      const cleanCep = cep.replace(/\D/g, '');
      
      if (cleanCep.length !== 8) {
        throw new Error('CEP inválido');
      }
      
      const response = await axios.get<ViaCepResponse>(`https://viacep.com.br/ws/${cleanCep}/json/`);
      
      if (response.data.erro) {
        throw new Error('CEP não encontrado');
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
  // Buscar todos os assinantes
  async getAll(params?: { skip?: number; limit?: number; name?: string; is_active?: boolean }): Promise<Subscriber[]> {
    try {
      // IMPORTANTE: Usar consistentemente a URL correta recomendada pelo backend
      console.log('Fazendo requisição para API:', '/subscribers/');
      const response = await api.get<ApiResponse>('/subscribers/', { 
        params,
        withCredentials: true
      });
      
      console.log('Resposta recebida:', response.status, response.statusText);
      return response.data.items;
    } catch (error) {
      console.error('Erro ao buscar assinantes:', error);
      
      // Antes de tentar fallback, verificar se temos alguma resposta útil do servidor
      const axiosError = error as any;
      if (axiosError.response?.data?.message) {
        console.log('Mensagem do servidor:', axiosError.response.data.message);
      }
      
      try {
        // Tentar o endpoint de fallback caso a API principal falhe
        console.log('Tentando endpoint fallback');
        const fallbackResponse = await api.get<ApiResponse>('/api/subscribers/fallback');
        console.log('Usando dados de fallback');
        return fallbackResponse.data.items;
      } catch (fallbackError) {
        // Se até o fallback falhar, lançar o erro original
        throw error;
      }
    }
  },

  // Buscar assinante por ID
  async getById(id: string): Promise<SubscriberDetail> {
    try {
      // IMPORTANTE: Usar consistentemente a URL correta recomendada pelo backend
      // Garantir que o endpoint termina com /
      console.log(`Fazendo requisição para API: /subscribers/${id}/`);
      const response = await api.get<SubscriberDetail>(`/subscribers/${id}/`, {
        withCredentials: true
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
      
      throw error;
    }
  },

  // Atualizar status do assinante (ativar/desativar)
  async updateStatus(id: string, isActive: boolean): Promise<Subscriber> {
    try {
      // IMPORTANTE: Usar consistentemente a URL correta recomendada pelo backend
      // Garantir que o endpoint termina com /
      const endpoint = isActive 
        ? `/subscribers/${id}/activate/` 
        : `/subscribers/${id}/deactivate/`;
      
      console.log(`Fazendo requisição PATCH para API: ${endpoint}`);
      const response = await api.patch<Subscriber>(endpoint, {}, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Resposta de atualização recebida:', response.status);
      return response.data;
    } catch (error) {
      console.error(`Erro ao ${isActive ? 'ativar' : 'desativar'} assinante com ID ${id}:`, error);
      
      // Log detalhado para debug e capturar mensagens úteis do servidor
      const axiosError = error as any;
      if (axiosError.response?.data?.message) {
        console.log('Mensagem do servidor:', axiosError.response.data.message);
      }
      
      throw error;
    }
  }
};