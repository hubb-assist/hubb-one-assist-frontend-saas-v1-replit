import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createProxyMiddleware } from 'http-proxy-middleware';
import { log } from "./vite";

export async function registerRoutes(app: Express): Promise<Server> {
  // Definir a URL da API externa (URL final de produção)
  const API_TARGET = 'https://hubb-one-assist-back-hubb-one.replit.app';
  
  // Configurar proxy mais simples para evitar problemas de tipagem
  // @ts-ignore - Ignorando problemas de tipagem para simplificar
  const apiProxy = createProxyMiddleware({
    target: API_TARGET,
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      '^/external-api': ''
    },
    logLevel: 'debug'
  });

  // Rota de proxy para todas as requisições à API externa
  app.use('/external-api', apiProxy);

  // Outras rotas da aplicação
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
