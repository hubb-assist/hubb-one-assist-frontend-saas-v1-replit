import axios from 'axios';
import { API_CONFIG } from './config';

// Configuração base para o cliente axios usado em endpoints públicos
// A diferença é que não enviamos credenciais nem exigimos autenticação
const apiPublic = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 15000,
  withCredentials: false, // Importante: não enviar credenciais
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Tipos comuns
type PaginationParams = {
  skip?: number;
  limit?: number;
};

// Interface para segmentos públicos
export interface PublicSegment {
  id: string;
  nome: string;
  descricao?: string;
}

// Interface para planos públicos
export interface PublicPlan {
  id: string;
  name: string;
  segment_id: string;
  base_price: number;
  description?: string;
  modules: PublicPlanModule[];
}

// Interface para módulos em planos públicos
export interface PublicPlanModule {
  module_id: string;
  module_name?: string;
  is_free?: boolean;
}

// Serviço de endpoints públicos
export const publicService = {
  // Obter segmentos ativos (para seleção no onboarding)
  async getSegments(): Promise<PublicSegment[]> {
    try {
      console.log('Buscando segmentos públicos - usando fetch direto');
      // Usar fetch diretamente para ter mais controle sobre a requisição
      const fetchResponse = await fetch(`${API_CONFIG.BASE_URL}/public/segments/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        // Importante: não enviar credenciais para endpoints públicos
        credentials: 'omit'
      });
      
      // Log detalhado da resposta
      console.log(`Resposta da API: status ${fetchResponse.status}`);
      if (!fetchResponse.ok) {
        console.error(`Erro HTTP: ${fetchResponse.status}`);
        throw new Error(`Falha na requisição: ${fetchResponse.status}`);
      }
      
      // Converter para JSON
      const data = await fetchResponse.json();
      console.log('Dados recebidos da API:', data);
      
      // Verificar se a resposta tem o formato paginado {total, page, size, items}
      if (data && data.items && Array.isArray(data.items)) {
        console.log('Extraindo itens da resposta paginada:', data.items);
        return data.items;
      } else if (Array.isArray(data)) {
        // Caso a API retorne um array diretamente
        return data;
      } else {
        console.error('Formato de resposta inesperado:', data);
        return []; // Retorna array vazio para evitar erros no componente
      }
    } catch (error) {
      console.error('Erro ao buscar segmentos públicos:', error);
      throw error; // Propagar o erro para ser tratado pelo componente
    }
  },

  // Obter planos ativos por segmento (para seleção no onboarding)
  async getPlans(segmentId: string): Promise<PublicPlan[]> {
    try {
      console.log(`Buscando planos públicos para o segmento ${segmentId} - usando fetch direto`);
      // Usar fetch diretamente para ter mais controle sobre a requisição
      const fetchResponse = await fetch(`${API_CONFIG.BASE_URL}/public/plans/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        // Importante: não enviar credenciais para endpoints públicos
        credentials: 'omit'
      });
      
      // Log detalhado da resposta
      console.log(`Resposta da API planos: status ${fetchResponse.status}`);
      if (!fetchResponse.ok) {
        console.error(`Erro HTTP: ${fetchResponse.status}`);
        throw new Error(`Falha na requisição: ${fetchResponse.status}`);
      }
      
      // Converter para JSON
      const data = await fetchResponse.json();
      console.log('Dados de planos recebidos da API:', data);
      
      // Extrair os planos da resposta paginada
      let planos: PublicPlan[] = [];
      
      if (data && data.items && Array.isArray(data.items)) {
        // Resposta paginada
        planos = data.items;
      } else if (Array.isArray(data)) {
        // Array direto
        planos = data;
      } else {
        console.error('Formato de resposta inesperado para planos:', data);
        return [];
      }
      
      // Filtrar apenas os planos do segmento solicitado
      const planosFiltrados = planos.filter(plan => plan.segment_id === segmentId);
      console.log(`Planos filtrados para o segmento ${segmentId}:`, planosFiltrados);
      return planosFiltrados;
    } catch (error) {
      console.error('Erro ao buscar planos públicos:', error);
      throw error; // Propagar o erro para ser tratado pelo componente
    }
  },

  // Obter detalhes de um plano específico
  async getPlanDetails(planId: string): Promise<PublicPlan> {
    try {
      console.log(`Buscando detalhes do plano ${planId} - usando fetch direto`);
      // Usar fetch diretamente para ter mais controle sobre a requisição
      const fetchResponse = await fetch(`${API_CONFIG.BASE_URL}/public/plans/${planId}/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        // Importante: não enviar credenciais para endpoints públicos
        credentials: 'omit'
      });
      
      // Log detalhado da resposta
      console.log(`Resposta da API detalhes do plano: status ${fetchResponse.status}`);
      if (!fetchResponse.ok) {
        console.error(`Erro HTTP: ${fetchResponse.status}`);
        throw new Error(`Falha na requisição: ${fetchResponse.status}`);
      }
      
      // Converter para JSON
      const data = await fetchResponse.json();
      console.log(`Detalhes do plano ${planId} recebidos da API:`, data);
      
      return data;
    } catch (error) {
      console.error(`Erro ao buscar detalhes do plano ${planId}:`, error);
      throw error; // Propagar o erro para ser tratado pelo componente
    }
  },

  // Registrar novo assinante (onboarding)
  async registerSubscriber(data: any) {
    try {
      console.log('Registrando novo assinante - usando fetch direto');
      // Usar fetch diretamente para ter mais controle sobre a requisição
      const fetchResponse = await fetch(`${API_CONFIG.BASE_URL}/public/subscribers/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        // Importante: não enviar credenciais para endpoints públicos
        credentials: 'omit',
        body: JSON.stringify(data)
      });
      
      // Log detalhado da resposta
      console.log(`Resposta da API cadastro de assinante: status ${fetchResponse.status}`);
      if (!fetchResponse.ok) {
        console.error(`Erro HTTP: ${fetchResponse.status}`);
        // Tentar obter detalhes do erro
        try {
          const errorData = await fetchResponse.json();
          console.error('Detalhes do erro:', errorData);
        } catch (e) {
          // Ignorar erro ao tentar ler resposta de erro
        }
        throw new Error(`Falha na requisição: ${fetchResponse.status}`);
      }
      
      // Converter para JSON
      const responseData = await fetchResponse.json();
      console.log('Resposta do cadastro de assinante:', responseData);
      
      return responseData;
    } catch (error) {
      console.error('Erro ao registrar assinante:', error);
      throw error;
    }
  }
};

// Não usamos mais dados mockados ou fallback
// Todos os dados devem vir diretamente da API