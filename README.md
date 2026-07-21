# 🏥 Sistema de Gestão de UBS Digital

Sistema completo de gestão para Unidades Básicas de Saúde (UBS) desenvolvido em Python com Flask e MySQL, com **interface profissional e design corporativo Medical Blue**.

## 📋 Descrição

Este sistema possui dois front-ends distintos que compartilham o mesmo banco de dados:

1. **Sistema do Paciente**: Permite que pacientes façam login, visualizem médicos disponíveis, agendem consultas e vejam seu histórico.
2. **Sistema do Recepcionista**: Permite que recepcionistas cadastrem novos pacientes, visualizem a agenda completa e atualizem o status das consultas.

## ✨ Novo Design Profissional

### Interface Corporativa Medical Blue

- ✅ **Bootstrap 5** para responsividade e componentes modernos
- ✅ **Bootstrap Icons** - Ícones profissionais (sem emojis)
- ✅ **Paleta Medical Blue** - Identidade visual institucional
- ✅ **Cards com sombras** - Design limpo e organizado
- ✅ **Logo UBS Digital** - Branding profissional
- ✅ **Tipografia Inter** - Fonte moderna do Google Fonts
- ✅ **Totalmente responsivo** - Funciona em desktop, tablet e mobile

### Capturas de Tela

**Login Profissional**
- Card centralizado com logo
- Tabs para Paciente/Recepcionista
- Background gradient Medical Blue

**Dashboard Moderno**
- Navbar com logo e informações do usuário
- Cards organizados com headers coloridos
- Tabelas estilizadas com ícones
- Badges de status coloridos

## 🛠️ Stack Tecnológica

### Backend
- **Python 3.x** com Flask
- **MySQL 8.0+** (Database)
- **SQLAlchemy** (ORM)

### Frontend
- **Bootstrap 5.3.2** (Framework CSS)
- **Bootstrap Icons 1.11.1** (Ícones)
- **Google Fonts - Inter** (Tipografia)
- **HTML5 + CSS3** (Markup)
- **JavaScript (Vanilla)** (Interatividade)
- **Jinja2** (Template Engine)

## 📁 Estrutura do Projeto

```text
ubs_system/
├── app.py                         # Aplicação principal Flask
├── config.py                      # Configurações do sistema
├── requirements.txt               # Dependências Python
├── README.md                      # Este arquivo
├── DESIGN_GUIDE.md                # Guia completo do design system
├── INSTRUCOES_DETALHADAS.md       # Guia passo a passo
├── database/
│   └── schema.sql                 # Script SQL para criar banco
├── templates/
│   ├── base.html                  # Template base com Bootstrap 5
│   ├── login.html                 # Login profissional
│   ├── dashboard_paciente.html    # Dashboard do paciente
│   ├── dashboard_recepcionista.html # Dashboard do recepcionista
│   └── historico_paciente.html    # Histórico de consultas
└── static/
    ├── css/
    │   └── style.css              # CSS customizado Medical Blue
    └── img/
        └── logo.png               # Logo UBS Digital