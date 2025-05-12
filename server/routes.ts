import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createProxyMiddleware } from 'http-proxy-middleware';
import { log } from "./vite";

export async function registerRoutes(app: Express): Promise<Server> {
  // Definir a URL da API externa (URL final de produção)
  const API_TARGET = 'https://hubb-one-assist-back-hubb-one.replit.app';
  
  // Middleware personalizado para logging de requisições proxy
  const logProxyRequests = (req: Request, _res: Response, next: NextFunction) => {
    log(`Proxy request: ${req.method} ${req.path}`);
    next();
  };
  
  // Middleware personalizado para CORS
  const addCorsHeaders = (_req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  };
  
  // Configurar proxy simples
  // @ts-ignore - Ignorando erro de propriedade 'logLevel'
  const apiProxy = createProxyMiddleware({
    target: API_TARGET,
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      '^/external-api': ''
    }
  });

  // Rota para lidar explicitamente com OPTIONS para preflight CORS (para /external-api)
  app.options('/external-api/*', (req: Request, res: Response) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin as string || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(200).send();
  });
  
  // Rota para lidar explicitamente com OPTIONS para preflight CORS (para /subscribers)
  app.options('/subscribers*', (req: Request, res: Response) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin as string || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(200).send();
  });

  // Configurar proxy para rota raiz direta
  // @ts-ignore - Ignorando erro de propriedade 'logLevel'
  const directApiProxy = createProxyMiddleware({
    target: API_TARGET,
    changeOrigin: true,
    secure: false,
    pathRewrite: {} // Sem reescrever caminhos
  });
  
  // Aplicar middlewares na ordem correta
  app.use('/external-api', logProxyRequests, addCorsHeaders, apiProxy);
  
  // Adicionar suporte à rota raiz também (/subscribers, etc)
  // Roteamento explícito para cada tipo de requisição para garantir que
  // o proxy funcione corretamente com todos os verbos HTTP
  app.get('/subscribers', logProxyRequests, addCorsHeaders, directApiProxy);
  app.get('/subscribers/:id', logProxyRequests, addCorsHeaders, directApiProxy);
  app.post('/subscribers', logProxyRequests, addCorsHeaders, directApiProxy);
  app.put('/subscribers/:id', logProxyRequests, addCorsHeaders, directApiProxy);
  app.patch('/subscribers/:id/activate', logProxyRequests, addCorsHeaders, directApiProxy);
  app.patch('/subscribers/:id/deactivate', logProxyRequests, addCorsHeaders, directApiProxy);
  
  // API endpoint para verificar se o proxy está funcionando
  app.get('/api/check-proxy', (req: Request, res: Response) => {
    res.json({ 
      status: 'ok', 
      message: 'Proxy server is running',
      proxyTarget: API_TARGET,
      timestamp: new Date().toISOString()
    });
  });
  
  // Endpoint para substituir caso de falha no proxy durante o desenvolvimento
  app.get('/api/subscribers/fallback', (_req: Request, res: Response) => {
    log('Enviando dados de fallback para subscribers - APENAS PARA DESENVOLVIMENTO');
    
    res.json({
      items: [],
      total: 0,
      page: 1,
      size: 10,
      message: "Este é um endpoint de fallback para desenvolvimento. Dados reais virão da API externa."
    });
  });

  // Outras rotas da aplicação
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
