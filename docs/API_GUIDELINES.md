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

### Endpoints Protegidos vs. Públicos

O HUBB ONE Assist utiliza dois tipos de endpoints:

1. **Endpoints Protegidos**: Requerem autenticação via JWT e devem incluir cookies de sessão
   ```typescript
   // Para endpoints protegidos, inclua credentials
   const protectedRequest = axios.create({
     baseURL: BASE_URL,
     withCredentials: true,
     headers: {
       'Content-Type': 'application/json',
       'Accept': 'application/json',
     }
   });
   ```

2. **Endpoints Públicos**: Não requerem autenticação (onboarding, login, etc.)
   ```typescript
   // Para endpoints públicos, não inclua credentials
   const publicRequest = fetch(`${BASE_URL}/public/segments/`, {
     method: 'GET',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
     },
     credentials: 'omit'
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

## Autenticação e Autorização

### Formato do Token JWT

O token JWT retornado pelo endpoint de login contém as seguintes informações:

```json
{
  "sub": "user_id",
  "name": "nome_do_usuario",
  "email": "email@usuario.com",
  "role": "SUPER_ADMIN/DIRETOR/COLABORADOR_NIVEL_2/DONO_ASSINANTE",
  "subscriber_id": "uuid_do_assinante_ou_null",
  "permissions": ["permissao1", "permissao2"],
  "exp": "timestamp_expiracao"
}
```

- Para usuários SUPER_ADMIN e DIRETOR, o campo `subscriber_id` será `null`
- Para usuários DONO_ASSINANTE, o campo `subscriber_id` conterá o UUID do assinante associado
- O campo `permissions` é um array de strings com as permissões do usuário

### Verificação de Autenticação

A autenticação e o payload do JWT devem ser verificados através do endpoint `/users/me`:

```typescript
async function verificarAutenticacao() {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    // Tratar erro de autenticação
    return null;
  }
}
```

### Controle de Acesso Baseado em Permissões

O frontend deve implementar verificações de permissões baseadas no array `permissions` do token:

```typescript
function hasPermission(requiredPermission: string): boolean {
  const currentUser = useUserStore.getState().user;
  return currentUser?.permissions?.includes(requiredPermission) || false;
}
```

## Rotas Públicas para Onboarding

O processo de onboarding utiliza as seguintes rotas públicas que não exigem autenticação:

```typescript
// Listar segmentos disponíveis
GET /public/segments/

// Listar planos por segmento
GET /public/plans/?segment_id=uuid

// Obter detalhes de um plano específico
GET /public/plans/{plan_id}/

// Registrar novo assinante
POST /public/subscribers/
```

### Registro de Novos Assinantes

O endpoint de registro de assinantes aceita o seguinte formato:

```typescript
interface SubscriberFormData {
  name: string;           // Nome do responsável
  clinic_name: string;    // Nome da clínica/empresa
  email: string;          // Email para contato/login
  phone: string;          // Telefone com formato (99) 99999-9999
  document: string;       // CPF/CNPJ com formato 999.999.999-99 ou 99.999.999/9999-99
  zip_code: string;       // CEP com formato 99999-999
  address: string;        // Logradouro
  number: string;         // Número
  city: string;           // Cidade
  state: string;          // Estado (UF com 2 caracteres)
  segment_id: string;     // UUID do segmento selecionado
  plan_id: string;        // UUID do plano selecionado
  password: string;       // Senha para acesso
  admin_password: string; // Senha do administrador (geralmente igual à senha)
}
```

Quando o registro é bem-sucedido, o backend:
1. Cria um novo registro de assinante (subscriber)
2. Cria um usuário administrador com role DONO_ASSINANTE
3. Associa o usuário ao assinante através do subscriber_id
4. Configura permissões básicas para o usuário

## Tratamento de Respostas Paginadas

As rotas da API retornam respostas paginadas no seguinte formato:

```json
{
  "total": 50,
  "page": 1,
  "size": 10,
  "items": [
    // Array de itens
  ]
}
```

Para extrair os itens de uma resposta paginada:

```typescript
async function getAll(params?: { skip?: number; limit?: number }) {
  try {
    const response = await api.get('/endpoint/', { params });
    // Extrair os itens da resposta paginada
    return response.data.items || [];
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return [];
  }
}
```

## Multi-tenancy e Isolamento de Dados

O backend aplica automaticamente filtros baseados no `subscriber_id` do usuário logado, garantindo que cada assinante só veja seus próprios dados. O frontend não precisa enviar esse parâmetro manualmente nas requisições.

Para usuários DONO_ASSINANTE, a interface deve mostrar apenas funcionalidades relacionadas ao seu próprio assinante, ocultando opções específicas para SUPER_ADMIN.

## Testes de API

Antes de cada release, teste:

1. Conexão com a API usando a URL correta
2. Autenticação e autorização
3. CORS - verifique se não há erros de Cross-Origin Resource Sharing
4. Timeout - verifique se as requisições têm um timeout adequado
5. Fluxo completo de onboarding - desde a seleção de segmento até o cadastro bem-sucedido

## Solução de Problemas

### Erro de CORS
Se ocorrer erro de CORS, verifique:
- A URL da API está correta
- `withCredentials` está configurado corretamente:
  - `true` para endpoints protegidos
  - `false` ou `'omit'` para endpoints públicos
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