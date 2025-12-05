# 🎨 Guia de Design - UBS Digital

## 📋 Visão Geral

Este documento descreve o sistema de design profissional implementado no **UBS Digital**, seguindo as melhores práticas de UI/UX para sistemas médicos corporativos.

---

## 🎯 Filosofia de Design

O design do UBS Digital foi criado com foco em:

- **Profissionalismo**: Interface corporativa e confiável
- **Clareza**: Informações médicas apresentadas de forma clara e organizada
- **Acessibilidade**: Cores e contrastes adequados para leitura prolongada
- **Responsividade**: Funciona perfeitamente em desktop, tablet e mobile

---

## 🎨 Paleta de Cores - Medical Blue

### Cores Primárias

| Cor | Hex | Uso |
|-----|-----|-----|
| **Primary Blue** | `#0d6efd` | Botões principais, headers, links |
| **Primary Dark** | `#0a58ca` | Hover states, ênfase |
| **Primary Light** | `#6ea8fe` | Backgrounds suaves, destaques |

### Cores Secundárias

| Cor | Hex | Uso |
|-----|-----|-----|
| **Secondary Teal** | `#0d9488` | Elementos de apoio |
| **Secondary Cyan** | `#7dd3c0` | Destaques secundários |

### Cores Neutras

| Cor | Hex | Uso |
|-----|-----|-----|
| **White** | `#ffffff` | Backgrounds de cards |
| **Gray 50** | `#f8f9fa` | Background geral |
| **Gray 100** | `#f1f3f5` | Headers de tabelas |
| **Gray 700** | `#495057` | Texto secundário |
| **Gray 800** | `#343a40` | Texto principal |

### Cores de Status

| Status | Cor | Hex | Uso |
|--------|-----|-----|-----|
| **Agendada** | Amarelo | `#ffc107` | Consultas pendentes |
| **Realizada** | Verde | `#198754` | Consultas concluídas |
| **Faltou** | Vermelho | `#dc3545` | Faltas registradas |

---

## 🔤 Tipografia

### Fonte Principal

**Inter** - Fonte moderna e profissional

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Hierarquia de Tamanhos

- **H1**: 2.5rem (40px) - Títulos principais
- **H2**: 1.75rem (28px) - Subtítulos de seção
- **H3**: 1.125rem (18px) - Títulos de cards
- **Body**: 1rem (16px) - Texto padrão
- **Small**: 0.875rem (14px) - Textos auxiliares

### Pesos

- **Regular (400)**: Texto padrão
- **Medium (500)**: Navbar, labels
- **Semibold (600)**: Botões, headers
- **Bold (700)**: Títulos principais

---

## 🧩 Componentes

### 1. Cards

Cards são o elemento principal de organização de conteúdo.

**Características:**
- Border-radius: `0.75rem` (12px)
- Box-shadow: `0 0.5rem 1rem rgba(0, 0, 0, 0.15)`
- Sem bordas (`border: none`)
- Header com background azul e texto branco

**Uso:**
- Formulários
- Tabelas
- Seções de conteúdo

### 2. Botões

**Tipos:**

| Tipo | Cor | Uso |
|------|-----|-----|
| `btn-primary` | Azul | Ações principais |
| `btn-success` | Verde | Confirmações positivas |
| `btn-danger` | Vermelho | Ações de remoção/negação |
| `btn-info` | Ciano | Informações/visualização |
| `btn-secondary` | Cinza | Ações secundárias |

**Características:**
- Padding: `0.75rem 1.5rem`
- Border-radius: `0.5rem`
- Font-weight: `600`
- Efeito hover com elevação

### 3. Tabelas

**Características:**
- Background branco
- Headers com background cinza claro
- Texto uppercase nos headers
- Hover effect nas linhas
- Border-left colorido por status

### 4. Badges de Status

**Características:**
- Border-radius: `2rem` (pill shape)
- Padding: `0.5rem 1rem`
- Font-weight: `600`
- Texto uppercase
- Cores conforme status

### 5. Formulários

**Características:**
- Border: `2px solid` (cinza)
- Border-radius: `0.5rem`
- Padding: `0.75rem 1rem`
- Focus state com borda azul e shadow suave

### 6. Tabs de Navegação

**Características:**
- Border-bottom no container
- Sem background nos links inativos
- Border-bottom azul no link ativo
- Ícones Bootstrap Icons

### 7. Alertas

**Características:**
- Border-radius: `0.75rem`
- Border-left: `4px solid` (cor do tipo)
- Padding: `1rem 1.5rem`
- Ícones contextuais

---

## 🎭 Ícones

### Biblioteca: Bootstrap Icons

**CDN:**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
```

### Ícones Principais Utilizados

| Contexto | Ícone | Classe |
|----------|-------|--------|
| Paciente | 👤 | `bi-person-circle` |
| Recepcionista | 🎫 | `bi-person-badge` |
| Médico | 🩺 | `bi-person-badge-fill` |
| Calendário | 📅 | `bi-calendar-event` |
| Agendar | ➕ | `bi-calendar-plus` |
| Histórico | 🕐 | `bi-clock-history` |
| Sucesso | ✅ | `bi-check-circle` |
| Erro | ❌ | `bi-x-circle` |
| Info | ℹ️ | `bi-info-circle` |
| Hospital | 🏥 | `bi-hospital` |
| Telefone | 📞 | `bi-telephone` |
| Lock | 🔒 | `bi-lock-fill` |
| Logout | 🚪 | `bi-box-arrow-right` |

**Nota:** Todos os emojis foram removidos e substituídos por ícones profissionais.

---

## 📐 Espaçamento

### Sistema de Grid

Utiliza o sistema de grid do Bootstrap 5 (12 colunas).

### Margens e Paddings

- **Container**: `padding: 0 20px`
- **Seções**: `margin-bottom: 2rem`
- **Cards**: `padding: 2rem`
- **Formulários**: `margin-bottom: 1.5rem` entre campos

---

## 🖼️ Logo

### Arquivo

- **Nome**: `logo.png`
- **Localização**: `/static/img/logo.png`
- **Formato**: PNG com transparência

### Uso

**Navbar:**
- Altura: `45px`
- Alinhamento: Esquerda com nome "UBS Digital"

**Login:**
- Largura máxima: `180px`
- Centralizado acima do formulário

---

## 📱 Responsividade

### Breakpoints (Bootstrap 5)

- **xs**: < 576px (mobile)
- **sm**: ≥ 576px (mobile landscape)
- **md**: ≥ 768px (tablet)
- **lg**: ≥ 992px (desktop)
- **xl**: ≥ 1200px (large desktop)

### Adaptações Mobile

- Logo reduzida para `35px`
- Padding de cards reduzido para `1.5rem`
- Font-size de tabelas reduzido para `0.875rem`
- Tabs em coluna ao invés de linha

---

## 🎬 Animações

### Fade In

Aplicado em seções do dashboard ao trocar de tab:

```css
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

### Hover Effects

- **Botões**: `translateY(-2px)` + shadow
- **Cards**: Aumento de shadow
- **Tabelas**: Background color change

---

## 🔧 Framework e Dependências

### Bootstrap 5.3.2

**CDN CSS:**
```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
```

**CDN JS:**
```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
```

### Bootstrap Icons 1.11.1

**CDN:**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
```

### Google Fonts - Inter

**CDN:**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## 📄 Páginas Implementadas

### 1. Login (`login.html`)

**Elementos:**
- Card centralizado com logo
- Tabs para Paciente/Recepcionista
- Formulários com ícones
- Background gradient

### 2. Dashboard Paciente (`dashboard_paciente.html`)

**Seções:**
- Header com saudação
- Tab: Agendar Consulta
- Tab: Minhas Consultas
- Tab: Histórico

### 3. Dashboard Recepcionista (`dashboard_recepcionista.html`)

**Seções:**
- Header profissional
- Tab: Agenda de Consultas
- Tab: Cadastrar Paciente
- Tab: Lista de Pacientes

### 4. Histórico (`historico_paciente.html`)

**Elementos:**
- Tabela de consultas passadas
- Cards de estatísticas
- Badges de status

---

## ✅ Checklist de Implementação

- ✅ Bootstrap 5 integrado via CDN
- ✅ Bootstrap Icons implementado
- ✅ Google Fonts Inter carregada
- ✅ Logo UBS Digital inserida
- ✅ Paleta Medical Blue aplicada
- ✅ Todos os emojis removidos
- ✅ Ícones profissionais em todos os elementos
- ✅ Cards com sombras e bordas arredondadas
- ✅ Navbar profissional com logo
- ✅ Tabelas estilizadas
- ✅ Badges de status coloridos
- ✅ Formulários modernos
- ✅ Responsividade mobile
- ✅ Animações suaves
- ✅ Footer corporativo

---

## 🎓 Boas Práticas Aplicadas

1. **Consistência Visual**: Mesmo estilo em todas as páginas
2. **Hierarquia Clara**: Títulos, subtítulos e conteúdo bem definidos
3. **Feedback Visual**: Hover states, active states, mensagens de sucesso/erro
4. **Acessibilidade**: Contraste adequado, textos legíveis
5. **Performance**: CDN para recursos externos
6. **Manutenibilidade**: CSS organizado com variáveis CSS
7. **Responsividade**: Mobile-first approach

---

## 📞 Suporte

Para dúvidas sobre o design system:

- **Bootstrap 5**: https://getbootstrap.com/docs/5.3/
- **Bootstrap Icons**: https://icons.getbootstrap.com/
- **Google Fonts**: https://fonts.google.com/

---

**Design System criado para UBS Digital - Interface Profissional para Gestão de Saúde** 🏥
