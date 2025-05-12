import api from './api';
import { Subscriber, SubscriberDetail } from '@/components/subscribers/types';

interface ApiResponse {
  total: number;
  page: number;
  size: number;
  items: Subscriber[];
}

export const subscribersService = {
  // Buscar todos os assinantes
  async getAll(params?: { skip?: number; limit?: number; name?: string; is_active?: boolean }): Promise<Subscriber[]> {
    try {
      const response = await api.get<ApiResponse>('/subscribers', { params });
      return response.data.items;
    } catch (error) {
      console.error('Erro ao buscar assinantes:', error);
      throw error;
    }
  },

  // Buscar assinante por ID
  async getById(id: string): Promise<SubscriberDetail> {
    try {
      const response = await api.get<SubscriberDetail>(`/subscribers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar assinante com ID ${id}:`, error);
      throw error;
    }
  },

  // Atualizar status do assinante (ativar/desativar)
  async updateStatus(id: string, isActive: boolean): Promise<Subscriber> {
    try {
      const response = await api.patch<Subscriber>(`/subscribers/${id}/status`, {
        is_active: isActive
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar status do assinante com ID ${id}:`, error);
      throw error;
    }
  }
};