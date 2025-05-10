import { create } from 'zustand';
import { authService } from './api';

// Definição do tipo de usuário
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
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
      console.log("Verificando autenticação...");
      const userData = await authService.verificarAutenticacao();
      if (userData) {
        console.log("Usuário autenticado:", userData);
        set({ user: userData, isAuthenticated: true });
      } else {
        console.log("Usuário não autenticado (resposta vazia)");
        set({ user: null, isAuthenticated: false });
      }
    } catch (error) {
      console.log("Estado de autenticação:", { isChecking: false, isLoading: false, isAuthenticated: false, currentRoute: window.location.pathname });
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