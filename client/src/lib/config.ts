// Arquivo de configuração central para o frontend

// URLs da API
export const API_CONFIG = {
  // URL da API de produção
  BASE_URL: 'https://hubb-one-assist-back-hubb-one.replit.app',
  
  // Timeout para requisições (em milissegundos)
  TIMEOUT: 15000,
  
  // URLs da API
  ENDPOINTS: {
    // Autenticação
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    USER_ME: '/users/me',
    
    // Segmentos
    SEGMENTS: '/segments',
    
    // Módulos
    MODULES: '/modules',
  }
};

// Configuração do frontend
export const APP_CONFIG = {
  // Nome da aplicação
  APP_NAME: 'HUBB ONE Assist',
  
  // Versão da aplicação
  VERSION: '1.0.0',
  
  // URL do frontend (para CORS)
  FRONTEND_URL: window.location.origin,
};