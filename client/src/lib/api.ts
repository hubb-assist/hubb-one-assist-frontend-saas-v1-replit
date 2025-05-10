import axios from 'axios';
import { toast } from 'sonner';

// URL da API temporária (garantindo sempre HTTPS)
// Extrair apenas o hostname para evitar problemas de protocolo
const hostname = '32c76b88-78ce-48ad-9c13-04975e5e14a3-00-12ynk9jfvcfqw.worf.replit.dev';
const API_URL = `https://${hostname}`;

// URL do domínio temporário (para configuração de CORS no backend)
// Adicione esta URL ao CORS no backend para permitir solicitações deste domínio
export const FRONTEND_URL = 'https://977761fe-66ad-4e57-b1d5-f3356eb27515.id.replit.com';

// Configuração do cliente axios
console.log("Configurando API com URL base:", API_URL);
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Importante para os cookies HttpOnly
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para garantir HTTPS
api.interceptors.request.use(config => {
  // Verificar se temos uma URL absoluta (com protocolo)
  if (config.url) {
    // Verificar se a URL começa com http://
    if (config.url.startsWith('http://')) {
      // Substituir http:// por https://
      config.url = config.url.replace('http://', 'https://');
      console.log('Convertida URL para HTTPS:', config.url);
    } 
    // Se for uma URL relativa e temos um hostname, forçamos a URL absoluta
    else if (!config.url.startsWith('https://') && !config.url.startsWith('http://')) {
      // Se a URL contém o hostname mas sem protocolo
      if (config.url.includes(hostname)) {
        config.url = `https://${config.url}`;
        console.log('Adicionado protocolo HTTPS à URL absoluta:', config.url);
      }
      // Caso seja apenas um caminho relativo, deixamos o axios usar o baseURL
    }
  }
  
  // Log da URL final que será usada
  console.log('Fazendo requisição para:', 
    config.baseURL ? 
      (config.url?.startsWith('http') ? config.url : `${config.baseURL}${config.url}`) 
      : config.url
  );
  
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