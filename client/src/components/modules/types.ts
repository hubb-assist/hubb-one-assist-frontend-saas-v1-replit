import { z } from 'zod';

export interface Module {
  id: string;
  name?: string;
  description?: string | null;
  nome?: string;         // Campo em português retornado pela API
  descricao?: string;    // Campo em português retornado pela API
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const moduleFormSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  description: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
});

export type ModuleFormValues = z.infer<typeof moduleFormSchema>;