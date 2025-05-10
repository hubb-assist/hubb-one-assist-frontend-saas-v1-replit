# HUBB ONE Assist - Frontend SaaS

Este projeto é a interface de usuário (frontend) do HUBB ONE Assist, uma plataforma SaaS construída com React e Vite.

## 🧱 Stack Tecnológica

- **React** - Biblioteca para construção de interfaces
- **Vite** - Ferramenta de build ultrarrápida
- **Tailwind CSS** - Framework CSS utilitário
- **ShadCN UI** - Componentes acessíveis e customizáveis
- **Sonner** - Biblioteca para notificações toast
- **Lucide React** - Biblioteca de ícones SVG
- **Recharts** - Biblioteca para criação de gráficos com suporte a degradê
- **React Query** - Para gerenciamento de estado e requisições
- **Wouter** - Roteamento leve e eficiente

## 📁 Estrutura do Projeto

```
.
├── client/           # Código-fonte do frontend
│   ├── src/          # Arquivos principais do React
│   │   ├── assets/   # Imagens e recursos estáticos
│   │   ├── components/ # Componentes React
│   │   ├── hooks/    # Hooks personalizados
│   │   ├── lib/      # Bibliotecas e utilitários
│   │   │   ├── api.ts        # Cliente API centralizado
│   │   │   ├── config.ts     # Configurações da API
│   │   │   └── api-segments.ts  # Serviços específicos
│   │   └── pages/    # Páginas da aplicação
│   └── index.html    # Entrada HTML
├── server/           # Servidor Express para desenvolvimento e proxy
│   ├── routes.ts     # Rotas e configuração de proxy
│   └── vite.ts       # Configuração do Vite para desenvolvimento
├── docs/             # Documentação do projeto
│   └── API_GUIDELINES.md  # Diretrizes para integração com API
└── shared/           # Código compartilhado entre cliente e servidor
    └── schema.ts     # Esquemas e tipos de dados
```

## 🔌 Integração com API

Este frontend se conecta à API REST do HUBB ONE Assist localizada em:
```
https://hubb-one-assist-back-hubb-one.replit.app
```

Para detalhes sobre como trabalhar com a API, consulte o documento de diretrizes em [docs/API_GUIDELINES.md](docs/API_GUIDELINES.md).

