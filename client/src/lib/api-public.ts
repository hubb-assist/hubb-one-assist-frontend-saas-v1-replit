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
      return []; // Retornar array vazio em caso de erro
    }
  },

  // Obter planos ativos por segmento (para seleção no onboarding)
  async getPlans(segmentId: string): Promise<PublicPlan[]> {
    try {
      console.log(`Buscando planos públicos para o segmento ${segmentId}`);
      const response = await apiPublic.get(`/public/plans?segment_id=${segmentId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar planos públicos:', error);
      return []; // Retornar array vazio em caso de erro
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

// Implementação de fallbacks enquanto os endpoints não estão disponíveis
// Estes dados simulados serão usados apenas se a API retornar erro

const fallbackSegments: PublicSegment[] = [
  { id: '1', nome: 'Clínica Médica', descricao: 'Para clínicas médicas de pequeno e médio porte' },
  { id: '2', nome: 'Odontologia', descricao: 'Para consultórios e clínicas odontológicas' },
  { id: '3', nome: 'Fisioterapia', descricao: 'Para clínicas de fisioterapia e reabilitação' },
  { id: '4', nome: 'Psicologia', descricao: 'Para consultórios e clínicas de psicologia' },
  { id: '5', nome: 'Nutrição', descricao: 'Para consultórios de nutrição e bem-estar' }
];

const fallbackPlans: Record<string, PublicPlan[]> = {
  '1': [
    {
      id: '101',
      name: 'Básico Médico',
      segment_id: '1',
      base_price: 199.90,
      description: 'Plano básico para clínicas médicas iniciantes',
      modules: [
        { module_id: 'm1', module_name: 'Agenda', is_free: true },
        { module_id: 'm2', module_name: 'Pacientes', is_free: true }
      ]
    },
    {
      id: '102',
      name: 'Premium Médico',
      segment_id: '1',
      base_price: 349.90,
      description: 'Plano completo para clínicas médicas',
      modules: [
        { module_id: 'm1', module_name: 'Agenda', is_free: true },
        { module_id: 'm2', module_name: 'Pacientes', is_free: true },
        { module_id: 'm3', module_name: 'Financeiro', is_free: false },
        { module_id: 'm4', module_name: 'Relatórios', is_free: false }
      ]
    }
  ],
  '2': [
    {
      id: '201',
      name: 'Básico Odontológico',
      segment_id: '2',
      base_price: 179.90,
      description: 'Plano básico para consultórios odontológicos',
      modules: [
        { module_id: 'm1', module_name: 'Agenda', is_free: true },
        { module_id: 'm2', module_name: 'Pacientes', is_free: true }
      ]
    },
    {
      id: '202',
      name: 'Premium Odontológico',
      segment_id: '2',
      base_price: 329.90,
      description: 'Plano completo para clínicas odontológicas',
      modules: [
        { module_id: 'm1', module_name: 'Agenda', is_free: true },
        { module_id: 'm2', module_name: 'Pacientes', is_free: true },
        { module_id: 'm3', module_name: 'Financeiro', is_free: false },
        { module_id: 'm4', module_name: 'Odontograma', is_free: false }
      ]
    }
  ]
};

// Função que retorna segmentos de fallback caso a API falhe
export const getFallbackSegments = (): PublicSegment[] => {
  return fallbackSegments;
};

// Função que retorna planos de fallback caso a API falhe
export const getFallbackPlans = (segmentId: string): PublicPlan[] => {
  return fallbackPlans[segmentId] || [];
};