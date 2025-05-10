import { z } from 'zod';

// Enumeração para os papéis de usuário do sistema
export enum SystemUserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  DIRETOR = 'DIRETOR',
  COLABORADOR_NIVEL_2 = 'COLABORADOR_NIVEL_2',
}

// Tipo do usuário do sistema conforme retornado pela API
export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: SystemUserRole;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

// Schema para validação do formulário de criação de usuário
export const systemUserCreateSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
  role: z.enum([SystemUserRole.SUPER_ADMIN, SystemUserRole.DIRETOR, SystemUserRole.COLABORADOR_NIVEL_2], {
    errorMap: () => ({ message: 'Cargo inválido' })
  }),
  is_active: z.boolean().default(true),
});

// Schema para validação do formulário de atualização de usuário
export const systemUserUpdateSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  email: z.string().email({ message: 'E-mail inválido' }),
  role: z.enum([SystemUserRole.SUPER_ADMIN, SystemUserRole.DIRETOR, SystemUserRole.COLABORADOR_NIVEL_2], {
    errorMap: () => ({ message: 'Cargo inválido' })
  }),
  is_active: z.boolean().default(true),
});

// Tipo inferido do schema para uso no formulário de criação
export type SystemUserCreateValues = z.infer<typeof systemUserCreateSchema>;

// Tipo inferido do schema para uso no formulário de atualização
export type SystemUserUpdateValues = z.infer<typeof systemUserUpdateSchema>;

// Mapeamento de roles para nomes amigáveis em português
export const roleLabels: Record<SystemUserRole, string> = {
  [SystemUserRole.SUPER_ADMIN]: 'Administrador',
  [SystemUserRole.DIRETOR]: 'Diretor',
  [SystemUserRole.COLABORADOR_NIVEL_2]: 'Colaborador Nível 2',
};