import axios from 'axios';
import { toast } from 'sonner';

// Definindo a URL da API implantada
export const API_HOSTNAME = 'hubb-one-assist-back-hubb-one.replit.app';
export const API_BASE_URL = `https://${API_HOSTNAME}`;

// URL do domínio temporário (para configuração de CORS no backend)
export const FRONTEND_URL = window.location.origin;

// Usando a URL da API estável implantada
console.log("Configurando API - usando URL estável implantada:", API_BASE_URL);
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Importante para os cookies HttpOnly
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para URLs consistentes
api.interceptors.request.use(config => {
  // Garantir que a URL não tem barras duplas
  if (config.url) {
    // Remover barra final (exceto para raiz)
    if (config.url.endsWith('/') && config.url !== '/') {
      config.url = config.url.slice(0, -1);
    }
    
    // Se não começar com /, adiciona
    if (!config.url.startsWith('/')) {
      config.url = `/${config.url}`; 
    }
  }
  
  // Log da URL final (com baseURL)
  const baseUrl = config.baseURL || '';
  const url = config.url || '';
  console.log('Fazendo requisição para API:', baseUrl + url);
  
  return config;
});

// Interceptor para erros
api.interceptors.response.use(
  response => response,
  error => {
    console.error('Erro na requisição:', error);
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
      console.log("Solicitando verificação de autenticação: /users/me");
      const response = await api.get('/users/me');
      console.log("Resposta de verificação de autenticação:", response.status, response.data);
      return response.data;
    } catch (error) {
      console.error("Erro na verificação de autenticação:", error);
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