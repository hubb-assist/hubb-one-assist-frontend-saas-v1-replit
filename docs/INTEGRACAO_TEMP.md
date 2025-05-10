# 🔗 Integração Temporária Frontend ↔ Backend

## URL da API (temporária)
```
https://32c76b88-78ce-48ad-9c13-04975e5e14a3-00-12ynk9jfvcfqw.worf.replit.dev/
```

## CORS configurado para:
- http://localhost:5173
- http://localhost:3000
- *.replit.dev

## Configuração de Acesso de Teste
- **Email**: admin@hubbassist.com
- **Senha**: admin123

## Exemplos de Integração

### Login (usando fetch)
```ts
async function login(email: string, password: string) {
  try {
    const response = await fetch('https://32c76b88-78ce-48ad-9c13-04975e5e14a3-00-12ynk9jfvcfqw.worf.replit.dev/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      throw new Error('Falha na autenticação');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
}
```

### Login (usando axios)
```ts
import axios from 'axios';

// Configuração global
axios.defaults.baseURL = 'https://32c76b88-78ce-48ad-9c13-04975e5e14a3-00-12ynk9jfvcfqw.worf.replit.dev';
axios.defaults.withCredentials = true;

async function login(email: string, password: string) {
  try {
    const response = await axios.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
}
```

### Verificação de Autenticação
```ts
async function verificarAutenticacao() {
  try {
    const response = await axios.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Usuário não autenticado:', error);
    return null;
  }
}
```

## Considerações Importantes

1. **Cookies HttpOnly**: O JWT é armazenado em cookies HttpOnly, não sendo necessário armazenar tokens manualmente no frontend.

2. **Tratamento de Erros**: Sempre implemente tratamento de erros adequado nas chamadas à API.

3. **Loading States**: Utilize os componentes de loading do ShadCN UI durante as requisições.

4. **Interceptor Axios**: Configurar um interceptor para tratamento global de erros:

```ts
// Arquivo: client/src/lib/api.ts
import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: 'https://32c76b88-78ce-48ad-9c13-04975e5e14a3-00-12ynk9jfvcfqw.worf.replit.dev',
  withCredentials: true
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
```

## Próximos Passos

1. Criar uma tela de login utilizando o componente AppShell
2. Implementar a integração com a API temporária
3. Adicionar controle de estados (loading, error) durante a autenticação
4. Criar um contexto de autenticação para gerenciar o estado do usuário logado

**Observação**: Esta configuração é temporária e deve ser atualizada quando o backend definitivo estiver disponível.