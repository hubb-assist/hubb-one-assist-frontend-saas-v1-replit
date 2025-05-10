import axios from 'axios';
import { toast } from 'sonner';

// URL da API temporária (garantindo sempre HTTPS)
export const API_HOSTNAME = '32c76b88-78ce-48ad-9c13-04975e5e14a3-00-12ynk9jfvcfqw.worf.replit.dev';
export const API_BASE_URL = `https://${API_HOSTNAME}`;

// URL do domínio temporário (para configuração de CORS no backend)
export const FRONTEND_URL = 'https://977761fe-66ad-4e57-b1d5-f3356eb27515.id.replit.com';

// Não usar baseURL para evitar problemas de Mixed Content
console.log("Configurando API - usando URLs absolutas");
const api = axios.create({
  withCredentials: true, // Importante para os cookies HttpOnly
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
  // Permite URLs absolutas
  baseURL: undefined,
  allowAbsoluteUrls: true
});

// Interceptor para garantir HTTPS
api.interceptors.request.use(config => {
  // Se não for URL absoluta, convertermos em uma URL absoluta com HTTPS
  if (config.url && !config.url.startsWith('http')) {
    // Remove barra inicial se houver
    const path = config.url.startsWith('/') ? config.url : `/${config.url}`;
    // Cria URL absoluta com HTTPS
    config.url = `https://${API_HOSTNAME}${path}`;
  } 
  // Se for URL absoluta com http, convertemos para https
  else if (config.url && config.url.startsWith('http://')) {
    config.url = config.url.replace('http://', 'https://');
  }
  
  // Log da URL final
  console.log('Fazendo requisição para:', config.url);
  
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