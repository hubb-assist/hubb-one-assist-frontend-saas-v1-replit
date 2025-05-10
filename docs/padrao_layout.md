# Padrão de Layout do Sistema HUBB ONE Assist

> **IMPORTANTE**: Este documento define o padrão oficial de layout do HUBB ONE Assist. Não modifique esta estrutura sem autorização.

## Estrutura Atual de Componentes

### Componentes de Layout em Uso
- **AppShell** (`client/src/components/layout/app-shell.tsx`)
  - **Responsabilidade**: Componente principal que define a estrutura básica da aplicação, incluindo sidebar e cabeçalho.
  - **Status**: ✅ Ativo e em uso como container principal
  - **Observação**: Gerencia o estado de abertura/fechamento da sidebar e responsividade

- **Header** (`client/src/components/layout/header.tsx`)
  - **Responsabilidade**: Cabeçalho para todas as páginas com título, notificações, "Meus Dados" e avatar
  - **Status**: ✅ Ativo e em uso 
  - **Observação**: Implementação padronizada que substitui AppHeader e HeaderDashboard

- **SidebarMain** (`client/src/components/sidebar/sidebar-main.tsx`)
  - **Responsabilidade**: Menu lateral com navegação principal
  - **Status**: ✅ Ativo e em uso
  - **Observação**: Bem estruturado com props para controle de expansão/colapso

### Componentes Existentes mas Não Utilizados (Legados)
- **AppHeader** (`client/src/components/layout/app-header.tsx`)
  - **Status**: ❌ Descontinuado (substituído pelo Header)

- **HeaderDashboard** (`client/src/components/header/header-dashboard.tsx`)
  - **Status**: ❌ Descontinuado (substituído pelo Header)

- **AppLayout** (`client/src/components/layout/app-layout.tsx`)
  - **Status**: ❌ Não utilizado

- **MainLayout** (`client/src/components/layout/main-layout.tsx`)
  - **Status**: ❌ Não utilizado

## Cores e Branding Oficiais

- **Cores Oficiais**:
  - **Primária**: `#2D113F` (roxo escuro)
  - **Secundária**: `#C52339` (vermelho)

- **Logo**:
  - **Logo principal**: `https://sq360.com.br/logo-hubb-novo/logo_hubb_assisit.png`
  - **Ícone**: `https://sq360.com.br/logo-hubb-novo/hubb_pet_icon.png`

## Hierarquia de Componentes Padronizada

```
AppShell (container principal)
├── Sidebar (menu lateral com cor #2D113F)
│   └── SidebarMain (implementação do menu colapsável)
├── Header (cabeçalho principal)
│   ├── Notificações
│   ├── Meus Dados
│   ├── Avatar do Usuário
│   └── Botão de Logout
└── Main Content (conteúdo da página)
```

## Padrão para Criar Novas Páginas

```jsx
import React from "react";
import AppShell from "@/components/layout/app-shell";

export default function NovaPagina() {
  return (
    <AppShell>
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-6">Título da Página</h2>
        
        {/* Conteúdo da página */}
        <div>
          Conteúdo da página aqui
        </div>
      </div>
    </AppShell>
  );
}
```

## Padrões de Props para Componentes

### Header
- `title`: Título principal da página
- `subtitle`: Subtítulo opcional
- `user`: Objeto com dados do usuário
- `onLogout`: Função para lidar com o logout
- `isMobile`: Flag para indicar exibição mobile
- `onToggleSidebar`: Função para alternar o menu lateral (em mobile)

### Sidebar
- `expanded`: Flag indicando se está expandido
- `isMobile`: Flag para comportamento mobile
- `onToggle`: Função para alternar o estado

## Regras Importantes

1. **NÃO MODIFIQUE** a estrutura básica do AppShell
2. **NÃO MODIFIQUE** as cores primária e secundária
3. **NÃO ALTERE** a lógica de expansão/colapso da sidebar
4. **SEMPRE ENVOLVA** novas páginas com o componente AppShell
5. **MANTENHA** a estrutura de pastas e componentes organizadas
6. **USE** o componente Header para todos os cabeçalhos

## Responsabilidades dos Componentes

### AppShell
- Gerenciar o estado de abertura/fechamento da sidebar
- Renderizar o layout principal com sidebar e área de conteúdo
- Garantir responsividade em dispositivos móveis e desktop

### Header
- Exibir título e navegação contextual
- Mostrar notificações, perfil e opções de conta
- Adaptar visualização para dispositivos móveis

### SidebarMain
- Exibir links de navegação
- Adaptar visualização baseado no estado de expansão/colapso
- Destacar o item de menu ativo baseado na rota atual

## Implementações Futuras

Todos os novos componentes de interface devem seguir esta estrutura padronizada. As modificações de componentes existentes devem respeitar esta hierarquia. Qualquer exceção a este padrão deve ser documentada e justificada.