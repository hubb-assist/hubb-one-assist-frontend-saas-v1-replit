# Estrutura de Componentes do HUBB ONE Assist

## Visão Geral

Este documento descreve a estrutura oficial de componentes do HUBB ONE Assist. Esta estrutura é fixa e segue padrões de arquitetura enterprise para garantir a manutenibilidade e escalabilidade do projeto.

## Hierarquia de Diretórios

```
client/src/
├── components/
│   ├── header/         # Componentes de cabeçalho
│   ├── layout/         # Componentes de layout principal
│   ├── sidebar/        # Componentes da barra lateral
│   ├── setup/          # Componentes específicos da página de setup
│   └── ui/             # Componentes de UI reutilizáveis
├── hooks/              # Hooks personalizados
├── lib/                # Utilitários e serviços
├── pages/              # Páginas da aplicação
└── assets/             # Recursos estáticos
```

## Estrutura de Componentes

### Componentes de Layout

#### AppShell (`components/layout/app-shell.tsx`)
- Componente raiz que envolve toda a aplicação
- Gerencia o estado e comportamento da sidebar
- **NÃO DEVE SER MODIFICADO**

```tsx
<AppShell>
  {children}
</AppShell>
```

#### SidebarMain (`components/sidebar/sidebar-main.tsx`)
- Renderiza os itens de navegação na sidebar
- Adapta-se baseado no estado de expansão/colapso
- **NÃO DEVE SER MODIFICADO**

### Componentes de UI

O projeto utiliza componentes do ShadCN UI, encontrados em `components/ui/`. Exemplos:

- `Button`: Botões com variantes
- `Card`: Cards para agrupar conteúdo
- `Tooltip`: Tooltips para exibir informações adicionais
- `Dialog`: Modais e diálogos
- `Toaster`: Notificações toast

## Responsabilidades por Diretório

### `/components/layout`
- Componentes estruturais de layout
- Gerencia a disposição principal da aplicação
- **NÃO ADICIONAR** novos componentes sem aprovação

### `/components/sidebar`
- Componentes relacionados à barra lateral
- Itens de navegação e lógica da sidebar
- **NÃO MODIFICAR** sem aprovação

### `/components/header`
- Componentes do cabeçalho superior
- Ações globais e notificações
- **MANTER** padrão visual consistente

### `/components/ui`
- Componentes de interface reutilizáveis
- **PREFERIR** uso de componentes existentes antes de criar novos

### `/pages`
- Componentes de página completa
- **SEMPRE** usar `AppShell` como wrapper
- **SEGUIR** o padrão estabelecido para novas páginas

## Hierarquia Visual

```
+---------------------------------------------+
|                  AppShell                   |
| +------------------+ +--------------------+ |
| |                  | |                    | |
| |                  | |                    | |
| |    SidebarMain   | |  Página específica | |
| |                  | |                    | |
| |                  | |                    | |
| |                  | |                    | |
| +------------------+ +--------------------+ |
+---------------------------------------------+
```

## Convenções de Nomenclatura

- **Componentes**: PascalCase (ex: `SidebarMain`)
- **Arquivos**:
  - Componentes: `nome-do-componente.tsx`
  - Hooks: `use-nome-do-hook.ts`
  - Utilitários: `nome-util.ts`
- **Estilos**: Tailwind CSS diretamente nos componentes

## Regras para Contribuição

1. **NUNCA MODIFIQUE** a estrutura principal de layout
2. **NUNCA REMOVA** componentes existentes sem aprovação
3. **SEMPRE SIGA** os padrões visuais e estruturais estabelecidos
4. **SEMPRE REUTILIZE** componentes existentes quando possível
5. **MANTENHA** a organização dos diretórios conforme especificado

## Cores e Tema

As cores primárias do projeto são definidas em `client/src/index.css` e **NÃO DEVEM SER ALTERADAS**:

- Primária: `#2D113F` (roxo escuro)
- Secundária: `#C52339` (vermelho)

Este documento deve ser seguido rigorosamente para manter a integridade da estrutura do projeto.