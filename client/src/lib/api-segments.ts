import api from './api';
import { Segment, SegmentFormValues } from '@/components/segments/types';

// API de Segmentos
export const segmentsService = {
  // Listar todos os segmentos
  async getAll(): Promise<Segment[]> {
    try {
      const response = await api.get('/segments/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar segmentos:', error);
      throw error;
    }
  },

  // Buscar um segmento por ID
  async getById(id: string): Promise<Segment> {
    try {
      const response = await api.get(`/segments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar segmento ${id}:`, error);
      throw error;
    }
  },

  // Criar um novo segmento
  async create(data: SegmentFormValues): Promise<Segment> {
    try {
      const response = await api.post('/segments/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar segmento:', error);
      throw error;
    }
  },

  // Atualizar um segmento existente
  async update(id: string, data: SegmentFormValues): Promise<Segment> {
    try {
      const response = await api.put(`/segments/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar segmento ${id}:`, error);
      throw error;
    }
  },

  // Excluir um segmento
  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/segments/${id}`);
    } catch (error) {
      console.error(`Erro ao excluir segmento ${id}:`, error);
      throw error;
    }
  },

  // Atualizar apenas o status de um segmento (ativo/inativo)
  async updateStatus(id: string, isActive: boolean): Promise<Segment> {
    try {
      const response = await api.patch(`/segments/${id}`, { is_active: isActive });
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar status do segmento ${id}:`, error);
      throw error;
    }
  }
};