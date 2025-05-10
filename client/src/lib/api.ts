import axios from 'axios';
import { toast } from 'sonner';

// URL da API temporária
const API_URL = 'https://32c76b88-78ce-48ad-9c13-04975e5e14a3-00-12ynk9jfvcfqw.worf.replit.dev';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Importante para os cookies HttpOnly
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para erros
api.interceptors.response.use(
  response => response,
  error => {
    const mensagem = error.response?.data?.message || 'Erro ao comunicar com o servidor';
    toast.error(mensagem);
    return Promise.reject(error);
  }
);

export default api;

// Funções de autenticação
export const authService = {
  // Login com email e senha
  async login(email: string, password: string) {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verificar se o usuário está autenticado
  async verificarAutenticacao() {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      return null;
    }
  },

  // Fazer logout
  async logout() {
    try {
      await api.post('/auth/logout');
      return true;
    } catch (error) {
      return false;
    }
  }
};