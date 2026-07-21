# 🎨 Guia de Design e Arquitetura - UBS Digital

## 📋 Visão Geral

Este documento descreve o sistema de design profissional e a arquitetura técnica implementados no **UBS Digital**, seguindo as melhores práticas de UI/UX, segurança e Engenharia de Software para sistemas médicos corporativos.

---

## 🎯 Filosofia do Sistema

O UBS Digital foi construído sob quatro pilares fundamentais:

- **Profissionalismo Visual**: Interface corporativa e confiável, adequada para o ambiente de saúde.
- **Modernidade e Performance**: Arquitetura RESTful com requisições assíncronas (sem recarregamentos de página desnecessários).
- **Acessibilidade e Conforto**: Suporte nativo a Tema Claro e Tema Escuro (Dark Mode) para uso contínuo em recepções.
- **Segurança de Dados**: Implementação rigorosa de CORS e criptografia irreversível de credenciais.

---

## 🏗️ Arquitetura Técnica (Frontend & Backend)

O sistema adota uma clara separação de responsabilidades para garantir escalabilidade e manutenção:

### 1. API RESTful (Backend em Flask)
O servidor atua exclusivamente no processamento de dados e regras de negócio, comunicando-se via JSON utilizando os verbos HTTP corretos:
- **`GET`**: Busca de dados (ex: horários disponíveis, listas de pacientes).
- **`POST`**: Criação de recursos (ex: cadastro de consultas, novos pacientes).
- **`PUT`**: Atualização de recursos (ex: alteração de status, edição de perfil).
- **`DELETE`**: Remoção de recursos (ex: exclusão de agendamentos ou cadastros).

### 2. Segurança e Conformidade
- **CORS (Cross-Origin Resource Sharing)**: Habilitado globalmente para proteger a API contra requisições não autorizadas de origens externas.
- **Hashing de Senhas**: Utilização da biblioteca `werkzeug.security` para gerar hashes seguros. Nenhuma senha trafega ou é salva em texto puro no banco de dados.

---

## 🎨 Paleta de Cores - Medical Blue & Slate Dark

### Cores Primárias (Tema Claro)

| Cor | Hex | Uso |
|-----|-----|-----|
| **Primary Blue** | `#0d6efd` | Botões principais, headers, links, badges |
| **Primary Dark** | `#0a58ca` | Hover states, ênfase |
| **Primary Light** | `#6ea8fe` | Backgrounds suaves, destaques em cards |

### Tema Escuro (Dark Mode - Slate/Indigo)

O sistema possui um tema escuro perfeitamente balanceado para reduzir o cansaço visual:

| Cor | Hex | Uso no Dark Mode |
|-----|-----|------------------|
| **Dark BG** | `#1a1c28` | Fundo principal da aplicação |
| **Dark Surface**| `#222534` | Fundo de Cards, Navbar e Modais |
| **Dark Border** | `#32374d` | Divisórias e bordas de tabelas |
| **Dark Text** | `#e2e8f0` | Texto principal de alta legibilidade |

### Cores de Status

| Status | Cor | Hex | Uso |
|--------|-----|-----|-----|
| **Agendada** | Amarelo | `#ffc107` | Consultas pendentes |
| **Realizada** | Verde | `#198754` | Consultas concluídas |
| **Faltou** | Vermelho | `#dc3545` | Faltas registradas |

---

## 🔤 Tipografia e Formatação

### Fonte Principal
**Inter** - Fonte moderna e profissional, otimizada para interfaces web.

### Formatação Inteligente (IMask)
Os campos de entrada de dados utilizam a biblioteca JavaScript **IMask** para garantir a padronização em tempo real:
- **CPF**: `000.000.000-00`
- **Telefone**: `(00) 00000-0000`

---

## 🧩 Componentes UI (Design System)

### 1. Cards
- Sem bordas brutas, com cantos arredondados (`border-radius: 0.75rem`).
- Sombras suaves que aumentam no evento de `:hover`.
- Transição impecável entre os temas Claro e Escuro.

### 2. Tabelas Responsivas
- Células otimizadas com limitação de texto (`text-overflow: ellipsis`) para evitar quebra de layout em nomes longos.
- Indicadores visuais: Borda esquerda colorida (`border-left`) baseada no status dinâmico da consulta.

### 3. Modais de Ação Segura (RESTful)
- Nenhum formulário sensível (exclusão, atualização de status) submete diretamente.
- Todos acionam um **Modal de Confirmação**, que mediante o clique do usuário, dispara um evento assíncrono via `fetch` para a API.

### 4. Feedbacks Dinâmicos (Alertas)
- As mensagens de sucesso (verde) e erro (vermelho) são injetadas no DOM sem recarregar a página, graças à comunicação JSON.
- Temporizadores (`setTimeout`) garantem que mensagens de sucesso sumam suavemente após 1.5 a 4 segundos.

---

## 🔧 Framework e Dependências

### Core CSS / UI
**Bootstrap 5.3.2**
```html
<link href="[https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css](https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css)" rel="stylesheet">
<script src="[https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js](https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js)"></script>