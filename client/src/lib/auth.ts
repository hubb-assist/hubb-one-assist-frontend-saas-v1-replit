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
        await get().checkAuth();
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
}));