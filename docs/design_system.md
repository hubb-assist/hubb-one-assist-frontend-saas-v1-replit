# 🎨 HUBB Assist — Design System (V1)

> Este documento define as **regras imutáveis** de layout e identidade visual do projeto HUBB Assist.  
**Nenhuma modificação no layout, cores ou comportamento estrutural pode ser realizada sem aprovação formal do responsável técnico.**

---

## 🧱 Estrutura do Layout Padrão

```
+-------------+-----------------------------------------------+
| Sidebar     |              Header (C52339)                 |
| (2D113F)    +-----------------------------------------------+
|             |              Main Content Area               |
|             |                                               |
|             |                                               |
+-------------+-----------------------------------------------+
```

### 🧩 Sidebar
- Cor: `#2D113F` (cor primária)
- Altura: `100vh` (vai até o topo)
- Largura expandida: `240px` (`w-60`)
- Largura colapsada: `80px` (`w-20`)
- Comportamento: colapsável, com transição suave
- Logo (modo aberto): `https://sq360.com.br/logo-hubb-novo/logo_hubb_assisit.png`
- Logo (modo colapsado): `https://sq360.com.br/logo-hubb-novo/hubb_pet_icon.png`
- Menu: ícones com texto (expandido) / ícones com tooltip (colapsado)

### 🧩 Header
- Cor: `#C52339` (cor secundária)
- Altura: `64px` (`h-16`)
- Posição: `fixed top-0 left-[largura da sidebar] right-0`
- Conteúdo: título da página, notificações, avatar, botão colapsar

### 🧩 Área Principal
- Padding horizontal: `p-6`
- Margem esquerda: `ml-60` (ou `ml-20` no modo colapsado)
- Margem superior: `mt-16`

---

## 🎨 Paleta de Cores Oficial

| Nome         | Código HEX | Uso padrão                       |
|--------------|------------|----------------------------------|
| Primária     | `#2D113F`  | Sidebar, botões principais       |
| Secundária   | `#C52339`  | Header, destaques, botões        |
| Texto Claro  | `#FFFFFF`  | Textos sobre fundo escuro        |
| Texto Escuro | `#1B0B25`  | Textos sobre fundo claro         |
| Fundo Geral  | `#F5F5F5`  | Background da área principal     |
| Verde OK     | `#00B050`  | Indicadores de crescimento       |

---

## 🔐 Política de Alterações

> Qualquer alteração visual **deve ser submetida à revisão do responsável técnico.**  
> Este arquivo `design_system.md` serve como referência única e oficial.

---

## 📌 Versão

**Versão do Design:** v1.0  
**Última atualização:** `2025-05-09`  
**Responsável técnico:** *Luis Paim*