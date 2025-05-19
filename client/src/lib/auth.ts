import { create } from 'zustand';
import { authService } from './api';

// Definição do tipo de usuário
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  // Campo adicional para verificar explicitamente status de autenticação
  authenticated?: boolean;
  // Novos campos para permissões
  permissions?: string[];
  subscriber_id?: string;
  // Outros campos que podem vir do backend
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Interface do estado de autenticação
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  // Métodos consolidados de permissão
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  // Verificação por tipo de acesso
  canAccessAdmin: () => boolean;
  canAccessClinica: () => boolean;
  canAccessApp: () => boolean;
}

// Store de autenticação usando Zustand
export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,

  // Login
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const data = await authService.login(email, password);
      if (data) {
        // Verificar autenticação após login bem-sucedido
        await get().checkAuth();
        
        // Se a autenticação foi bem-sucedida, podemos considerar o redirecionamento inteligente
        // O redirecionamento propriamente dito será feito no componente de login
        return true;
      }
      return false;
    } catch (error) {
      set({ user: null, isAuthenticated: false });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // Logout
  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  // Verificar autenticação
  checkAuth: async () => {
    // Verificar se a rota atual é a página de login
    const isLoginPage = window.location.pathname === '/login';
    
    set({ isLoading: true });
    try {
      // Só exibe logs se não estiver na página de login
      if (!isLoginPage) {
        console.log("Verificando autenticação...");
      }
      
      const userData = await authService.verificarAutenticacao();
      
      // Validação mais rigorosa para verificar se o usuário está realmente autenticado
      const isValidUser = userData && 
                        userData.id && 
                        userData.email && 
                        // Verifica se não há flag explícita de não autenticado
                        userData.authenticated !== false;
      
      if (isValidUser) {
        // Só exibe logs se não estiver na página de login
        if (!isLoginPage) {
          console.log("Usuário autenticado:", userData);
        }
        set({ user: userData, isAuthenticated: true });
      } else {
        // Só exibe logs se não estiver na página de login
        if (!isLoginPage) {
          if (userData) {
            console.log("Usuário recebido, mas com status não autenticado:", userData);
          } else {
            console.log("Usuário não autenticado (resposta vazia)");
          }
        }
        // Limpar estado do usuário independentemente do tipo de resposta inválida
        set({ user: null, isAuthenticated: false });
      }
    } catch (error) {
      // Só exibe logs se não estiver na página de login
      if (!isLoginPage) {
        console.log("Estado de autenticação:", { isChecking: false, isLoading: false, isAuthenticated: false, currentRoute: window.location.pathname });
      }
      
      set({ user: null, isAuthenticated: false });
      
      // Se estiver na página de login, não propaga o erro, pois é esperado
      if (!isLoginPage) {
        throw error; // Propagar erro apenas se não estiver na página de login
      }
    } finally {
      set({ isLoading: false });
    }
  },

  // Verificação de permissão única
  hasPermission: (permission: string) => {
    const { user } = get();
    
    if (!user || !user.is_active) return false;

    // Verificar permissões diretas
    if (user.permissions?.includes(permission)) {
      return true;
    }
    
    // Verificação baseada na role (fallback)
    const role = user.role;
    
    // Permissões de pacientes
    if ((permission === 'CAN_CREATE_PATIENT' || 
         permission === 'CAN_VIEW_PATIENT' || 
         permission === 'CAN_EDIT_PATIENT' || 
         permission === 'CAN_DELETE_PATIENT') && 
        (role === 'DONO_ASSINANTE' || role === 'SUPER_ADMIN' || role === 'DIRETOR')) {
      return true;
    }
    
    // Permissões de administração
    if ((permission === 'CAN_MANAGE_SUBSCRIBERS' || 
         permission === 'CAN_MANAGE_USERS' || 
         permission === 'CAN_MANAGE_SEGMENTS' || 
         permission === 'CAN_MANAGE_MODULES' ||
         permission === 'CAN_MANAGE_PLANS') && 
        (role === 'SUPER_ADMIN' || role === 'DIRETOR')) {
      return true;
    }
    
    return false;
  },
  
  // Verificação de qualquer permissão em um array
  hasAnyPermission: (permissions: string[]) => {
    return permissions.some(permission => get().hasPermission(permission));
  },
  
  // Verificação de todas as permissões em um array
  hasAllPermissions: (permissions: string[]) => {
    return permissions.every(permission => get().hasPermission(permission));
  },
  
  // Verificação de acesso à área administrativa
  canAccessAdmin: () => {
    const { user } = get();
    if (!user) return false;
    
    return user.role === 'SUPER_ADMIN' || user.role === 'DIRETOR';
  },
  
  // Verificação de acesso à área da clínica
  canAccessClinica: () => {
    const { user } = get();
    if (!user) return false;
    
    return user.role === 'DONO_ASSINANTE' || user.role === 'SUPER_ADMIN';
  },
  
  // Verificação de acesso à área do app
  canAccessApp: () => {
    const { user } = get();
    if (!user) return false;
    
    return user.role === 'COLABORADOR_NIVEL_2' || user.role === 'SUPER_ADMIN';
  }
}));