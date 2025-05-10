# Documentação HUBB ONE Assist

## Introdução

Bem-vindo à documentação oficial do HUBB ONE Assist. Este projeto é uma aplicação SaaS desenvolvida com React + Vite, Tailwind CSS e ShadCN UI, seguindo uma estrutura de código enterprise.

## Documentos Importantes

### 1. [Padrão de Layout](./PADRAO_LAYOUT.md)
Define a estrutura oficial de layout do HUBB ONE Assist. **Esta estrutura não deve ser modificada**.

### 2. [Criação de Páginas](./CRIACAO_PAGINAS.md)
Guia passo a passo para criar novas páginas seguindo o padrão estabelecido.

### 3. [Estrutura de Componentes](./ESTRUTURA_COMPONENTES.md)
Descreve a organização dos componentes e a hierarquia de diretórios do projeto.

## Requisitos

- Node.js v20.x ou superior
- npm v10.x ou superior

## Tecnologias Principais

- **Frontend**: React 18 com Vite
- **Estilização**: Tailwind CSS
- **Componentes UI**: ShadCN UI
- **Notificações**: Sonner
- **Gráficos**: Recharts
- **Ícones**: Lucide React

## Cores Oficiais

- **Primária**: `#2D113F` (roxo escuro)
- **Secundária**: `#C52339` (vermelho)

## Iniciando o Projeto

```bash
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

O servidor será iniciado em `http://localhost:5000`.

## Estrutura de Arquivos Principal

```
/
├── client/             # Código frontend
│   ├── src/
│   │   ├── components/ # Componentes React
│   │   ├── hooks/      # Custom hooks
│   │   ├── lib/        # Utilitários
│   │   ├── pages/      # Páginas da aplicação
│   │   └── assets/     # Recursos estáticos
│   └── index.html      # Entrada HTML
├── server/             # Código backend
│   ├── index.ts        # Ponto de entrada do servidor
│   └── routes.ts       # Rotas da API
├── shared/             # Código compartilhado
│   └── schema.ts       # Esquemas de dados
└── docs/               # Documentação
```

## Regras Importantes

1. **NUNCA MODIFIQUE** a estrutura de layout principal
2. **NUNCA ALTERE** as cores primárias do projeto
3. **SEMPRE SIGA** os padrões de código e estrutura estabelecidos
4. **SEMPRE USE** o componente `AppShell` como wrapper para novas páginas

## Contato

Para questões relacionadas ao projeto, entre em contato com a equipe de desenvolvimento.