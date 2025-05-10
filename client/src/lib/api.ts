import axios from 'axios';
import { toast } from 'sonner';
import { API_CONFIG } from './config';

// Importando configuração da aplicação
const { BASE_URL, TIMEOUT, ENDPOINTS } = API_CONFIG;

// Utilizando a URL da API implantada a partir da configuração central
console.log("Configurando API - usando URL implantada:", BASE_URL);
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Habilitado conforme requisito da tarefa
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: TIMEOUT, // Timeout configurável
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
      console.log(`Tentando login no endpoint: ${ENDPOINTS.LOGIN}`);
      const response = await api.post(ENDPOINTS.LOGIN, { email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verificar se o usuário está autenticado
  async verificarAutenticacao() {
    try {
      console.log(`Solicitando verificação de autenticação: ${ENDPOINTS.USER_ME}`);
      const response = await api.get(ENDPOINTS.USER_ME);
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
      console.log(`Executando logout no endpoint: ${ENDPOINTS.LOGOUT}`);
      await api.post(ENDPOINTS.LOGOUT);
      return true;
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      return false;
    }
  }
};