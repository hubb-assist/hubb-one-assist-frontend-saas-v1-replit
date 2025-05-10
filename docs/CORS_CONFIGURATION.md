# Configuração de CORS para HUBB ONE Assist

## Domínio Temporário para Configuração CORS

O frontend do HUBB ONE Assist está sendo executado no seguinte domínio temporário:

```
https://977761fe-66ad-4e57-b1d5-f3356eb27515.id.replit.com
```

## Configuração no Backend

Para que a autenticação funcione corretamente, o backend deve permitir requisições CORS deste domínio. Adicione esta URL à lista de origens permitidas no servidor.

### Exemplo de Configuração CORS (Backend Python/FastAPI)

```python
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "https://977761fe-66ad-4e57-b1d5-f3356eb27515.id.replit.com",
    "http://localhost:5173",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  # Importante para cookies HttpOnly
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Exemplo de Configuração CORS (Backend Node.js/Express)

```javascript
const cors = require('cors');

const corsOptions = {
  origin: [
    'https://977761fe-66ad-4e57-b1d5-f3356eb27515.id.replit.com',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,  // Importante para cookies HttpOnly
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

## Importante

- Certifique-se de que `credentials: true` está habilitado para permitir o envio de cookies
- Após o deploy em produção, atualize a configuração CORS para incluir o domínio de produção
- Essa configuração é temporária e deve ser atualizada quando houver mudança de ambiente

## API Temporária

A API está configurada para acessar:

```
https://32c76b88-78ce-48ad-9c13-04975e5e14a3-00-12ynk9jfvcfqw.worf.replit.dev
```

Certifique-se de que o CORS está configurado neste endpoint para aceitar requisições do domínio temporário do frontend.