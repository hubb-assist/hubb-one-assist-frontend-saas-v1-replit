import axios from 'axios';
import { API_CONFIG } from './config';

// Configuração base para o cliente axios usado em endpoints públicos
// A diferença é que não enviamos credenciais nem exigimos autenticação
const apiPublic = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 15000,
  withCredentials: false // Importante: não enviar credenciais
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
      console.log('Buscando segmentos públicos');
      const response = await apiPublic.get('/public/segments');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar segmentos públicos:', error);
      throw error; // Propagar o erro para ser tratado pelo componente
    }
  },

  // Obter planos ativos por segmento (para seleção no onboarding)
  async getPlans(segmentId: string): Promise<PublicPlan[]> {
    try {
      console.log(`Buscando planos públicos para o segmento ${segmentId}`);
      const response = await apiPublic.get('/public/plans');
      
      // Filtrar apenas os planos do segmento solicitado
      return response.data.filter((plan: PublicPlan) => plan.segment_id === segmentId);
    } catch (error) {
      console.error('Erro ao buscar planos públicos:', error);
      throw error; // Propagar o erro para ser tratado pelo componente
    }
  },

  // Obter detalhes de um plano específico
  async getPlanDetails(planId: string): Promise<PublicPlan> {
    try {
      console.log(`Buscando detalhes do plano ${planId}`);
      const response = await apiPublic.get(`/public/plans/${planId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar detalhes do plano ${planId}:`, error);
      throw error; // Propagar o erro para ser tratado pelo componente
    }
  },

  // Registrar novo assinante (onboarding)
  async registerSubscriber(data: any) {
    try {
      console.log('Registrando novo assinante');
      const response = await apiPublic.post('/public/subscribers', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao registrar assinante:', error);
      throw error;
    }
  }
};

// Não usamos mais dados mockados ou fallback
// Todos os dados devem vir diretamente da API