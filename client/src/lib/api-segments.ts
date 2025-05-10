import api from './api';
import { Segment, SegmentFormValues } from '@/components/segments/types';

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
      // Certifique-se de usar a URL com a barra no final
      const response = await api.get('/segments/', { params });
      
      // A resposta da API tem um formato específico com a lista em 'items'
      const apiResponse = response.data as ApiResponse;
      
      // Retornar apenas o array de itens
      return apiResponse.items;
    } catch (error) {
      console.error('Erro ao buscar segmentos:', error);
      throw error;
    }
  },

  // Buscar um segmento por ID
  async getById(id: string): Promise<Segment> {
    try {
      const response = await api.get(`/segments/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar segmento ${id}:`, error);
      throw error;
    }
  },

  // Criar um novo segmento
  async create(data: SegmentFormValues): Promise<Segment> {
    try {
      // Adaptar o formato para o que a API espera
      const apiData = {
        name: data.nome,
        description: data.descricao || "",
        color: "#3B82F6" // Cor padrão azul, pode ser adicionada como campo no formulário mais tarde
      };
      
      const response = await api.post('/segments/', apiData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar segmento:', error);
      throw error;
    }
  },

  // Atualizar um segmento existente
  async update(id: string, data: SegmentFormValues): Promise<Segment> {
    try {
      // Adaptar o formato para o que a API espera
      const apiData = {
        name: data.nome,
        description: data.descricao || "",
        // Não enviar color na atualização a menos que seja explicitamente alterado
      };
      
      const response = await api.put(`/segments/${id}/`, apiData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar segmento ${id}:`, error);
      throw error;
    }
  },

  // Excluir um segmento
  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/segments/${id}/`);
    } catch (error) {
      console.error(`Erro ao excluir segmento ${id}:`, error);
      throw error;
    }
  },

  // Atualizar apenas o status de um segmento (ativo/inativo)
  async updateStatus(id: string, isActive: boolean): Promise<Segment> {
    try {
      // Usar rotas específicas para ativar/desativar
      const endpoint = isActive 
        ? `/segments/${id}/activate` 
        : `/segments/${id}/deactivate`;
        
      const response = await api.patch(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar status do segmento ${id}:`, error);
      throw error;
    }
  }
};