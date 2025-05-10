import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createProxyMiddleware, type Options } from 'http-proxy-middleware';
import { log } from "./vite";
import type * as http from 'http';

export async function registerRoutes(app: Express): Promise<Server> {
  // Definir a URL da API externa
  const API_TARGET = 'https://32c76b88-78ce-48ad-9c13-04975e5e14a3-00-12ynk9jfvcfqw.worf.replit.dev';
  
  // Configurar proxy para a API externa
  const apiProxy = createProxyMiddleware({
    target: API_TARGET,
    changeOrigin: true,
    secure: true, // Requer SSL certificates válidos
    // Para logging manual em vez de usar logLevel
    onProxyReq: (proxyReq, req, res) => {
      log(`Proxy request: ${req.method} ${req.url} -> ${API_TARGET}${req.url}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      log(`Proxy response: ${proxyRes.statusCode} for ${req.method} ${req.url}`);
    },
    onError: (err, req, res) => {
      log(`Proxy error: ${err.message}`);
      // Verifica se a resposta já foi enviada
      if (!res.headersSent) {
        res.status(500).json({
          message: 'Erro ao comunicar com a API externa',
          error: err.message
        });
      }
    }
  });

  // Rota de proxy para todas as requisições à API externa
  app.use('/api-proxy', apiProxy);

  // Outras rotas da aplicação
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
