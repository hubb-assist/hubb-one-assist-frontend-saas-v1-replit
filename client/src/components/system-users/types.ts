import { z } from 'zod';

// Tipos de papéis (roles) disponíveis no sistema
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'USER' | 'DONO_ASSINANTE';

// Mapeamento de roles para labels amigáveis
export const roleLabels: Record<UserRole, string> = {
  SUPER_ADMIN: 'Super Administrador',
  ADMIN: 'Administrador',
  MANAGER: 'Gerente',
  USER: 'Usuário',
  DONO_ASSINANTE: 'Dono de Assinante',
};

// Tipo principal de usuário do sistema
export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Schema para validação de criação de usuário
export const systemUserCreateSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'USER', 'DONO_ASSINANTE'], {
    required_error: 'Selecione um papel válido',
  }),
  is_active: z.boolean().default(true),
});

// Schema para validação de atualização de usuário
export const systemUserUpdateSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'USER', 'DONO_ASSINANTE'], {
    required_error: 'Selecione um papel válido',
  }),
  is_active: z.boolean().default(true),
});

// Tipos inferidos dos schemas
export type SystemUserCreateValues = z.infer<typeof systemUserCreateSchema>;
export type SystemUserUpdateValues = z.infer<typeof systemUserUpdateSchema>;