# Padrão de Layout do Sistema HUBB ONE Assist

## Estrutura Atual de Componentes

### Componentes de Layout em Uso
- **AppShell** (`client/src/components/layout/app-shell.tsx`)
  - **Responsabilidade**: Componente principal que define a estrutura básica da aplicação, incluindo a sidebar e o cabeçalho principal.
  - **Status**: ✅ Ativo e em uso como container principal
  - **Observação**: Contém implementação direta do cabeçalho (header), que deveria ser um componente separado

- **SidebarMain** (`client/src/components/sidebar/sidebar-main.tsx`)
  - **Responsabilidade**: Menu lateral com navegação principal
  - **Status**: ✅ Ativo e em uso
  - **Observação**: Bem estruturado com props para controle de expansão

### Componentes Existentes mas Não Utilizados
- **AppHeader** (`client/src/components/layout/app-header.tsx`)
  - **Responsabilidade**: Cabeçalho para layout principal com título, notificações e avatar
  - **Status**: ❌ Existente mas não utilizado
  - **Problema**: Foi substituído por implementação direta no AppShell

- **HeaderDashboard** (`client/src/components/header/header-dashboard.tsx`)
  - **Responsabilidade**: Cabeçalho alternativo para o dashboard
  - **Status**: ❌ Existente mas não utilizado
  - **Problema**: Confusão na hierarquia de componentes

- **AppLayout** (`client/src/components/layout/app-layout.tsx`)
  - **Responsabilidade**: Layout alternativo para páginas do aplicativo
  - **Status**: ❌ Existente mas não utilizado

- **MainLayout** (`client/src/components/layout/main-layout.tsx`)
  - **Responsabilidade**: Outro layout alternativo
  - **Status**: ❌ Existente mas não utilizado

## Solução Recomendada

### 1. Padronização do Cabeçalho (Header)

Devemos extrair o cabeçalho do AppShell para um componente separado seguindo estes passos:

1. **Criar um novo componente Header**: `client/src/components/layout/header.tsx`
   - Mover a implementação atual do cabeçalho para este componente
   - Adicionar props para personalização (título, subtítulo, etc.)
   - Implementar os elementos UI: notificações, perfil, logout e "Meus Dados"

2. **Atualizar o AppShell**:
   - Importar e utilizar o novo componente Header
   - Passar as props necessárias (usuário, funções de logout, etc.)

3. **Remover ou Depreciar**:
   - Marcar HeaderDashboard como deprecated
   - Marcar AppHeader como deprecated
   - Documentar no código a transição para o novo padrão

### 2. Hierarquia de Componentes Recomendada

```
AppShell (container principal)
├── Sidebar (menu lateral)
│   └── SidebarMain (implementação do menu)
├── Header (cabeçalho principal)
│   ├── Notificações
│   ├── Meus Dados
│   ├── Avatar do Usuário
│   └── Botão de Logout
└── Main Content (conteúdo da página)
```

### 3. Padrões de Props para Componentes

- **Header**:
  - `title`: Título principal da página
  - `subtitle`: Subtítulo opcional
  - `user`: Objeto com dados do usuário
  - `onLogout`: Função para lidar com o logout
  - `isMobile`: Flag para indicar exibição mobile
  - `onToggleSidebar`: Função para alternar o menu lateral (em mobile)

- **Sidebar**:
  - `expanded`: Flag indicando se está expandido
  - `isMobile`: Flag para comportamento mobile
  - `onToggle`: Função para alternar o estado

## Próximos Passos

1. Implementar o componente Header conforme estrutura recomendada
2. Refatorar o AppShell para usar o novo componente
3. Remover código duplicado dos outros componentes de cabeçalho não utilizados
4. Atualizar a documentação conforme as mudanças forem implementadas

## Regra Geral para Futuras Implementações

- Todos os novos componentes de interface devem seguir esta estrutura padronizada
- As modificações de componentes existentes devem respeitar esta hierarquia
- Qualquer exceção a este padrão deve ser documentada e justificada