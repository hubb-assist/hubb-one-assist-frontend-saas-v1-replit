import api from './api';
import { Segment, SegmentFormValues } from '@/components/segments/types';
import { API_CONFIG } from './config';

// Importando configuração centralizada
const { ENDPOINTS } = API_CONFIG;

// Interface da resposta da API
interface ApiResponse {
  total: number;
  page: number;
  size: number;
  items: Segment[];
}

// API de Segmentos
export const segmentsService = {
  // Listar todos os segmentos
  async getAll(params?: { skip?: number; limit?: number; nome?: string; is_active?: boolean }): Promise<Segment[]> {
    try {
      // Usar caminho direto para a API
      const path = '/segments';
      console.log('Buscando segmentos na API:', path, 'com params:', params);
      
      // Logar informações detalhadas para debug
      const response = await api.get(path, { params });
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
      console.error('Erro ao buscar segmentos:', error);
      // Vamos retornar um array vazio em vez de lançar o erro, para evitar loops
      return [];
    }
  },

  // Buscar um segmento por ID
  async getById(id: string): Promise<Segment> {
    try {
      // Usar caminho direto para a API
      const path = `/segments/${id}`;
      console.log(`Buscando segmento na API: ${path}`);
      
      const response = await api.get(path);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar segmento ${id}:`, error);
      throw error;
    }
  },

  // Criar um novo segmento
  async create(data: SegmentFormValues): Promise<Segment> {
    try {
      // Usar o formato exato que o backend espera (baseado no feedback do backend)
      // Mantenha os nomes dos campos em português conforme a API espera
      const apiData = {
        nome: data.nome,
        descricao: data.descricao || "",
        color: "#3B82F6" // Cor padrão azul, pode ser adicionada como campo no formulário mais tarde
      };
      
      // Usar caminho direto para a API
      const path = '/segments';
      console.log(`Criando segmento na API: ${path}`);
      console.log('Dados enviados para API:', apiData);
      
      const response = await api.post(path, apiData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar segmento:', error);
      throw error;
    }
  },

  // Atualizar um segmento existente
  async update(id: string, data: SegmentFormValues): Promise<Segment> {
    try {
      // Usar o formato exato que o backend espera (baseado no feedback do backend)
      // Mantenha os nomes dos campos em português
      const apiData = {
        nome: data.nome,
        descricao: data.descricao || "",
        // Não enviar color na atualização a menos que seja explicitamente alterado
      };
      
      // Usar caminho direto para a API
      const path = `/segments/${id}`;
      console.log(`Atualizando segmento na API: ${path}`);
      console.log('Dados enviados para API:', apiData);
      
      const response = await api.put(path, apiData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar segmento ${id}:`, error);
      throw error;
    }
  },

  // Excluir um segmento
  async delete(id: string): Promise<void> {
    try {
      // Usar caminho direto para a API
      const path = `/segments/${id}`;
      console.log(`Excluindo segmento na API: ${path}`);
      await api.delete(path);
    } catch (error) {
      console.error(`Erro ao excluir segmento ${id}:`, error);
      throw error;
    }
  },

  // Atualizar apenas o status de um segmento (ativo/inativo)
  async updateStatus(id: string, isActive: boolean): Promise<Segment> {
    try {
      // Usar rotas específicas para ativar/desativar sem barra no final
      const path = isActive 
        ? `/segments/${id}/activate` 
        : `/segments/${id}/deactivate`;
      
      console.log(`Atualizando status do segmento ${id} para ${isActive ? 'ativo' : 'inativo'} na API: ${path}`);
      
      const response = await api.patch(path);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar status do segmento ${id}:`, error);
      throw error;
    }
  }
};