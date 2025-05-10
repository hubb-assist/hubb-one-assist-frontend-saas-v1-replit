# Guia para Criação de Novas Páginas no HUBB ONE Assist

## Introdução

Este documento fornece um guia passo a passo para a criação de novas páginas no HUBB ONE Assist, garantindo que todas as páginas sigam o mesmo padrão de layout e design estabelecido.

## Passos para Criar uma Nova Página

### 1. Crie o Arquivo da Página

Todas as páginas devem ser criadas no diretório `client/src/pages/`.

```
client/src/pages/nome-da-pagina.tsx
```

### 2. Use o Template Padrão

Sempre comece com este template básico:

```tsx
import React from "react";
import AppShell from "@/components/layout/app-shell";
// Importe outros componentes necessários

export default function NomeDaPagina() {
  return (
    <AppShell>
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-6">Título da Página</h2>
        
        {/* Conteúdo da sua página */}
        <div>
          Conteúdo da página aqui
        </div>
      </div>
    </AppShell>
  );
}
```

### 3. Registre a Rota

Adicione a nova rota no arquivo `client/src/App.tsx`:

```tsx
// Dentro da função Router
<Route path="/nome-da-rota" component={NomeDaPagina} />
```

### 4. Adicione ao Menu da Sidebar (opcional)

Se a página precisa aparecer no menu lateral, adicione-a ao arquivo `client/src/components/sidebar/sidebar-main.tsx`:

```tsx
<NavItem
  href="/nome-da-rota"
  icon={<IconeApropriado className="h-5 w-5" />}
  label="Nome no Menu"
  expanded={expanded}
  active={pathname === '/nome-da-rota'}
/>
```

## Componentes Comuns para Páginas

### Cards

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Conteúdo do card */}
  </CardContent>
</Card>
```

### Botões

```tsx
import { Button } from "@/components/ui/button";

<Button>Botão Padrão</Button>
<Button variant="outline">Botão Outline</Button>
<Button variant="destructive">Botão Destrutivo</Button>
```

### Notificações Toast

```tsx
import { toast } from "sonner";

// Dentro de uma função ou evento
toast.success("Operação realizada com sucesso!");
toast.error("Ocorreu um erro");
toast.info("Informação importante");
```

## Práticas Recomendadas

1. **Sempre** use o componente `AppShell` como wrapper principal
2. **Sempre** siga as convenções de nomenclatura (PascalCase para componentes)
3. **Sempre** mantenha a consistência visual com as outras páginas
4. **Nunca** modifique a estrutura principal do layout
5. **Nunca** altere as cores principais da aplicação
6. **Nunca** remova ou modifique o comportamento da sidebar

## Exemplo Completo

```tsx
import React from "react";
import AppShell from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserPlus, FileText } from "lucide-react";

export default function GerenciamentoUsuarios() {
  return (
    <AppShell>
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-6">Gerenciamento de Usuários</h2>
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Usuário</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Cadastre um novo usuário no sistema.</p>
              <Button 
                onClick={() => toast.success("Formulário de usuário aberto")}
                className="w-full"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Novo Usuário
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Relatórios</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Acesse os relatórios de usuários.</p>
              <Button 
                variant="outline"
                onClick={() => toast.info("Gerando relatório...")}
                className="w-full"
              >
                <FileText className="mr-2 h-4 w-4" />
                Gerar Relatório
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
```

Este documento serve como referência oficial para a criação de novas páginas no HUBB ONE Assist. Siga-o rigorosamente para manter a consistência do projeto.