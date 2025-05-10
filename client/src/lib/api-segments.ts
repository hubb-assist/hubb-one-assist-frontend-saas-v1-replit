import api, { API_HOSTNAME, API_BASE_URL } from './api';
import { Segment, SegmentFormValues } from '@/components/segments/types';

// Interface da resposta da API
interface ApiResponse {
  total: number;
  page: number;
  size: number;
  items: Segment[];
}

// Função para criar URL absoluta HTTPS para API
function buildApiUrl(path: string): string {
  // Remover barra final se existir (conforme recomendação do backend)
  if (path.endsWith('/') && path !== '/') {
    path = path.slice(0, -1);
  }
  
  // Se já começar com https://, retornamos como está
  if (path.startsWith('https://')) {
    return path;
  }
  
  // Se começar com http://, substituímos por https://
  if (path.startsWith('http://')) {
    return path.replace('http://', 'https://');
  }
  
  // Se não tiver protocolo, criamos URL absoluta com HTTPS
  // Garantir formato correto do path
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `https://${API_HOSTNAME}${cleanPath}`;
}

// API de Segmentos
export const segmentsService = {
  // Listar todos os segmentos
  async getAll(params?: { skip?: number; limit?: number; nome?: string; is_active?: boolean }): Promise<Segment[]> {
    try {
      // Usar URL absoluta HTTPS explícita
      const url = buildApiUrl('/segments');
      console.log('Fazendo requisição GET para URL absoluta HTTPS:', url, 'com params:', params);
      
      const response = await api.get(url, { params });
      
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
      // Usar URL absoluta HTTPS explícita
      const url = buildApiUrl(`/segments/${id}`);
      console.log(`Buscando segmento com URL absoluta HTTPS: ${url}`);
      
      const response = await api.get(url);
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
      
      // Usar URL absoluta HTTPS explícita
      const url = buildApiUrl('/segments');
      console.log(`Criando segmento com URL absoluta HTTPS: ${url}`);
      console.log('Dados enviados para API:', apiData);
      
      const response = await api.post(url, apiData);
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
      
      // Usar URL absoluta HTTPS explícita
      const url = buildApiUrl(`/segments/${id}`);
      console.log(`Atualizando segmento com URL absoluta HTTPS: ${url}`);
      console.log('Dados enviados para API:', apiData);
      
      const response = await api.put(url, apiData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar segmento ${id}:`, error);
      throw error;
    }
  },

  // Excluir um segmento
  async delete(id: string): Promise<void> {
    try {
      // Usar URL absoluta HTTPS explícita
      const url = buildApiUrl(`/segments/${id}`);
      console.log(`Excluindo segmento com URL absoluta HTTPS: ${url}`);
      await api.delete(url);
    } catch (error) {
      console.error(`Erro ao excluir segmento ${id}:`, error);
      throw error;
    }
  },

  // Atualizar apenas o status de um segmento (ativo/inativo)
  async updateStatus(id: string, isActive: boolean): Promise<Segment> {
    try {
      // Usar rotas específicas para ativar/desativar sem barra no final
      const endpoint = isActive 
        ? `/segments/${id}/activate` 
        : `/segments/${id}/deactivate`;
      
      // Usar URL absoluta HTTPS explícita
      const url = buildApiUrl(endpoint);
      console.log(`Atualizando status do segmento ${id} para ${isActive ? 'ativo' : 'inativo'}, URL absoluta HTTPS: ${url}`);
      
      // Usar a URL absoluta HTTPS
      const response = await api.patch(url);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar status do segmento ${id}:`, error);
      throw error;
    }
  }
};