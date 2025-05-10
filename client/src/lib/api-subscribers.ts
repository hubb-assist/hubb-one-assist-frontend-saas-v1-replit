import axios from 'axios';
import { API_CONFIG } from './config';

// Importando configuração centralizada
const { BASE_URL } = API_CONFIG;

// Interface para dados de assinante
export interface SubscriberFormData {
  name: string;
  clinic_name: string;
  email: string;
  phone: string;
  document: string;
  zip_code: string;
  address: string;
  number: string;
  city: string;
  state: string;
  segment_id: string;
  plan_id: string;
  password: string;
  admin_password: string;
}

// Configuração específica para subscribers
const subscribersApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // Importante: false para evitar problemas de CORS
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000
});

// Adicionar interceptors para debug
subscribersApi.interceptors.request.use(config => {
  // Log da URL final
  const baseURL = config.baseURL || '';
  const url = config.url || '';
  console.log('Requisição de assinantes para:', baseURL + url);
  return config;
});

// API de Assinantes
export const subscribersService = {
  // Criar novo assinante
  async create(data: SubscriberFormData) {
    try {
      console.log('Enviando dados de novo assinante:', data);
      const response = await subscribersApi.post('/subscribers', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar assinante:', error);
      throw error;
    }
  }
};

// Serviço de integração com ViaCEP
interface ViaCEPResponse {
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
}

export const viaCepService = {
  async getAddressByCep(cep: string): Promise<ViaCEPResponse | null> {
    try {
      // Remover caracteres não numéricos
      const cleanCep = cep.replace(/\D/g, '');
      
      if (cleanCep.length !== 8) {
        throw new Error('CEP inválido');
      }
      
      const response = await axios.get<ViaCEPResponse>(`https://viacep.com.br/ws/${cleanCep}/json/`);
      
      if (response.data.erro) {
        throw new Error('CEP não encontrado');
      }
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      return null;
    }
  }
};