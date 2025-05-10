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

// Função para verificar se estamos na página de login
const isLoginPage = () => window.location.pathname === '/login';

// Interceptor para erros
api.interceptors.response.use(
  response => response,
  error => {
    // Verificando se é um erro 401 na rota /users/me (esperado quando não autenticado)
    const isUserMeEndpoint = error.config?.url?.includes(ENDPOINTS.USER_ME);
    const isUnauthorized = error.response?.status === 401;
    
    // Se for erro 401 em /users/me, tratamos silenciosamente sem exibir toast
    if (isUserMeEndpoint && isUnauthorized) {
      // Em vez de logar o erro, apenas retornamos sem mensagem
      // console.log('Usuário não autenticado (401) - comportamento esperado na rota de login');
      return Promise.reject(error);
    }
    
    // Para outros erros, mas estamos na página de login, não mostrar toast para erros de autenticação
    if (isLoginPage() && (isUnauthorized || error.response?.status === 403)) {
      return Promise.reject(error);
    }
    
    // Para outros erros, mantemos o comportamento original
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
      // Verificar se a rota atual é a página de login
      const isLoginPage = window.location.pathname === '/login';
      
      // Se estiver na página de login, log silencioso
      if (!isLoginPage) {
        console.log(`Solicitando verificação de autenticação: ${ENDPOINTS.USER_ME}`);
      }
      
      const response = await api.get(ENDPOINTS.USER_ME);
      
      // Se houver resposta bem-sucedida, verificar se o usuário está realmente autenticado
      // Verifica se a resposta contém o campo 'authenticated' e se é falso
      if (response.data && response.data.authenticated === false) {
        if (!isLoginPage) {
          console.log("Resposta indica que o usuário não está autenticado:", response.data);
        }
        return null; // Retorna null para indicar que não está autenticado
      }
      
      // Verifica se a resposta não contém propriedades esperadas de um usuário (id, email)
      if (response.data && (!response.data.id || !response.data.email)) {
        if (!isLoginPage) {
          console.log("Resposta não contém dados válidos de usuário:", response.data);
        }
        return null; // Retorna null para indicar que não está autenticado
      }
      
      // Se houver resposta bem-sucedida, registrar o sucesso (exceto na página de login)
      if (!isLoginPage) {
        console.log("Resposta de verificação de autenticação:", response.status, response.data);
      }
      
      return response.data;
    } catch (error) {
      // Silenciar todos os erros na página de login, não exibir nenhum log
      if (window.location.pathname !== '/login') {
        console.error("Erro na verificação de autenticação:", error);
      }
      return null;
    }
  },

  // Fazer logout
  async logout() {
    try {
      console.log(`Executando logout no endpoint: ${ENDPOINTS.LOGOUT}`);
      await api.post(ENDPOINTS.LOGOUT);
      console.log('Logout bem-sucedido');
      return true;
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      return false;
    } finally {
      // Mesmo que falhe no backend, redireciona para login
      window.location.href = '/login';
    }
  }
};