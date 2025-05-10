# Diretrizes para Integração com API no HUBB ONE Assist

## Configuração da URL da API

### URL Padrão de Produção
```javascript
// URL base para ambiente de produção (NUNCA altere esta URL sem atualizar toda a documentação)
const API_URL = 'https://hubb-one-assist-back-hubb-one.replit.app';
```

### Configuração Centralizada
Todas as URLs da API devem ser configuradas de forma centralizada em `client/src/lib/config.ts`:

```typescript
// Arquivo client/src/lib/config.ts
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
    
    // Outros endpoints...
  }
};
```

### Importação Correta
Ao criar novos módulos, sempre importe a configuração centralizada:

```typescript
import { API_CONFIG } from './config';
const { BASE_URL, ENDPOINTS } = API_CONFIG;
```

## Configuração do Cliente HTTP (Axios)

### Configuração Básica
Para evitar problemas de CORS, configure o cliente HTTP sem credentials:

```typescript
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // Importante: deve ser false para evitar problemas de CORS
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: TIMEOUT,
});
```

### Interceptores para Debug
Adicione interceptores para log e debugging:

```typescript
// Interceptor para URLs consistentes
api.interceptors.request.use(config => {
  // Log da URL final (com baseURL)
  console.log('Fazendo requisição para API:', config.baseURL + config.url);
  return config;
});
```

## Tratamento de Erros

```typescript
api.interceptors.response.use(
  response => response,
  error => {
    console.error('Erro na requisição:', error);
    const mensagem = error.response?.data?.message || 'Erro ao comunicar com o servidor';
    toast.error(mensagem);
    return Promise.reject(error);
  }
);
```

## Testes de API

Antes de cada release, teste:

1. Conexão com a API usando a URL correta
2. Autenticação e autorização
3. CORS - verifique se não há erros de Cross-Origin Resource Sharing
4. Timeout - verifique se as requisições têm um timeout adequado

## Solução de Problemas

### Erro de CORS
Se ocorrer erro de CORS, verifique:
- A URL da API está correta
- `withCredentials` está configurado como `false`
- O backend permite requisições do domínio do frontend

### URL da API Incorreta
Se o frontend estiver apontando para uma URL incorreta:
1. Atualize o arquivo `client/src/lib/config.ts`
2. Faça o deploy da nova versão
3. Limpe o cache do navegador (Ctrl+F5 ou Cmd+Shift+R)

### Uso de Proxy
Em ambientes locais de desenvolvimento, considere usar um proxy para evitar problemas de CORS:
```javascript
// server/routes.ts
const apiProxy = createProxyMiddleware({
  target: API_TARGET,
  changeOrigin: true,
  secure: false,
  pathRewrite: {
    '^/external-api': ''
  }
});
app.use('/external-api', apiProxy);
```