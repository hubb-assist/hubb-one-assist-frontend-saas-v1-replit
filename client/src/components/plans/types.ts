import { z } from 'zod';
import { Module } from '@/components/modules/types';
import { Segment } from '@/components/segments/types';

// Tipo do módulo em um plano
export interface PlanModule {
  module_id: string;
  custom_price: number | null; // null ou 0 se for gratuito
  trial_days: number | null;
  is_active?: boolean; // se o módulo está ativo neste plano
  // Campo para armazenar os dados completos do módulo quando disponíveis
  module?: Module;
}

// Tipo do plano conforme retornado pela API
export interface Plan {
  id: string;
  name: string;
  segment_id: string;
  base_price: number;  // Renomeado de 'price' para 'base_price' para corresponder à API
  description?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  modules: PlanModule[];
  
  // Campos opcionais para exibição na UI (preenchidos após processamento)
  segment?: Segment;
  nome?: string; // Campo em português
  descricao?: string; // Campo em português
}

// Schema para validação do módulo em um plano
export const planModuleSchema = z.object({
  module_id: z.string().min(1, { message: 'O módulo é obrigatório' }),
  custom_price: z.number().nullable().default(null),
  trial_days: z.number().nullable().default(null),
  is_free: z.boolean().default(false), // Campo auxiliar para indicar se o módulo é gratuito
});

// Schema para validação do formulário de plano
export const planFormSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  segment_id: z.string().min(1, { message: 'Segmento é obrigatório' }),
  base_price: z.number().min(0, { message: 'O preço não pode ser negativo' }),
  description: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
  modules: z.array(planModuleSchema).min(1, { message: 'Selecione pelo menos um módulo' }),
});

// Tipo inferido do schema para uso no formulário
export type PlanFormValues = z.infer<typeof planFormSchema>;

// Tipo para o formulário de módulo em um plano
export type PlanModuleFormValues = z.infer<typeof planModuleSchema>;