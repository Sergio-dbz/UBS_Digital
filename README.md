# 🏥 Sistema de Gestão de UBS Digital

Sistema completo de gestão para Unidades Básicas de Saúde (UBS) desenvolvido em Python com Flask e MySQL, com **interface profissional e design corporativo Medical Blue**.

## 📋 Descrição

Este sistema possui dois front-ends distintos que compartilham o mesmo banco de dados:

1. **Sistema do Paciente**: Permite que pacientes façam login, visualizem médicos disponíveis, agendem consultas e vejam seu histórico.
2. **Sistema do Recepcionista**: Permite que recepcionistas cadastrem novos pacientes, visualizem a agenda completa e atualizem o status das consultas.

## ✨ Novo Design Profissional

### Interface Corporativa Medical Blue


### Capturas de Tela

**Login Profissional**

**Dashboard Moderno**

## 🛠️ Stack Tecnológica

### Backend
- **Python 3.x** com Flask
- **MySQL 8.0+** (Database)
- **SQLAlchemy** (ORM)

### Frontend
- **Bootstrap Icons 1.11.1** (Ícones)
- **Google Fonts - Inter** (Tipografia)
- **HTML5 + CSS3** (Markup)
- **JavaScript (Vanilla)** (Interatividade)
- **Jinja2** (Template Engine)

```
ubs_system/
├── app.py                          # Aplicação principal Flask
├── config.py                       # Configurações do sistema
├── requirements.txt                # Dependências Python
├── README.md                       # Este arquivo
├── DESIGN_GUIDE.md                 # Guia completo do design system
├── INSTRUCOES_DETALHADAS.md       # Guia passo a passo
├── database/
│   └── schema.sql                 # Script SQL para criar banco
├── templates/
│   ├── base.html                  # Template base com Bootstrap 5
│   ├── login.html                 # Login profissional
│   ├── dashboard_paciente.html    # Dashboard do paciente
│   ├── dashboard_recepcionista.html  # Dashboard do recepcionista
│   └── historico_paciente.html    # Histórico de consultas
└── static/
    ├── css/
    │   └── style.css              # CSS customizado Medical Blue
    └── img/
        └── logo.png               # Logo UBS Digital
        
```


```

## 🚀 Instalação e Configuração

### 1. Pré-requisitos

- Python 3.8 ou superior
- MySQL 8.0 ou superior
- MySQL Workbench (opcional, para gerenciar o banco)

### 2. Instalar Dependências Python

```bash
cd ubs_system
pip install -r requirements.txt
```

### 3. Configurar o Banco de Dados MySQL

#### Opção A: Usando MySQL Workbench

1. Abra o MySQL Workbench
2. Conecte-se ao seu servidor MySQL
3. Abra o arquivo `database/schema.sql`
4. Execute o script completo (Ctrl+Shift+Enter)

#### Opção B: Usando linha de comando

```bash
mysql -u root -p < database/schema.sql
```

### 4. Configurar Credenciais do Banco

Edite o arquivo `config.py` e ajuste as credenciais do MySQL:

```python
DB_HOST = 'localhost'
DB_PORT = '3306'
DB_USER = 'root'
DB_PASSWORD = 'SUA_SENHA_AQUI'  # Coloque sua senha do MySQL
DB_NAME = 'ubs_system'
```

### 5. Executar a Aplicação

```bash
python app.py
```

O sistema estará disponível em: **http://localhost:5000**

## 👥 Credenciais de Teste

### Recepcionistas

| Login    | Senha     | Nome         |
|----------|-----------|--------------|
| recep01  | senha123  | Maria Silva  |
| recep02  | senha456  | João Santos  |

### Pacientes

| CPF               | Senha        | Nome              | Cartão SUS       |
|-------------------|--------------|-------------------|------------------|
| 123.456.789-00    | paciente123  | Carlos Oliveira   | 123456789012345  |
| 987.654.321-00    | paciente456  | Ana Paula Costa   | 987654321098765  |

## 📖 Funcionalidades

### Sistema do Paciente

- ✅ Login com CPF e senha
- ✅ Visualizar médicos disponíveis com especialidades
- ✅ Agendar consultas para datas futuras
- ✅ Ver consultas agendadas em tabela organizada
- ✅ Acessar histórico de consultas passadas (apenas com status definido)
- ✅ Visualizar estatísticas de consultas realizadas e faltas

### Sistema do Recepcionista

- ✅ Login com usuário e senha
- ✅ Cadastrar novos pacientes (com Cartão SUS obrigatório)
- ✅ Visualizar agenda completa de consultas
- ✅ Atualizar status das consultas com botões visuais:
  - **✓ Compareceu/Realizada**: Paciente compareceu à consulta
  - **✗ Não Compareceu/Faltou**: Paciente não compareceu
- ✅ Listar todos os pacientes cadastrados com informações completas

## 🎨 Design System

### Paleta de Cores Medical Blue

- **Primary Blue**: `#0d6efd` - Botões, headers, links
- **Primary Dark**: `#0a58ca` - Hover states
- **Gray 50**: `#f8f9fa` - Background geral
- **Success**: `#198754` - Status "Realizada"
- **Warning**: `#ffc107` - Status "Agendada"
- **Danger**: `#dc3545` - Status "Faltou"

### Componentes Profissionais

- **Cards**: Bordas arredondadas, sombras suaves
- **Tabelas**: Headers estilizados, hover effects
- **Badges**: Status coloridos em formato pill
- **Botões**: Efeitos de elevação no hover
- **Formulários**: Borders destacados no focus

Para mais detalhes, consulte o **[DESIGN_GUIDE.md](DESIGN_GUIDE.md)**.

## 🔒 Regras de Negócio

1. **Apenas recepcionistas** podem cadastrar novos pacientes
2. O **Cartão SUS (CNS)** é obrigatório no cadastro
3. Pacientes podem agendar consultas apenas para datas futuras
4. O histórico do paciente mostra **apenas consultas passadas** com status "Realizada" ou "Faltou"
5. Recepcionistas podem alterar o status apenas de consultas "Agendadas"

## 🗄️ Estrutura do Banco de Dados

### Tabelas

1. **recepcionistas**: Armazena dados de login dos recepcionistas
2. **pacientes**: Armazena dados dos pacientes (incluindo CNS)
3. **medicos**: Armazena dados dos médicos e suas especialidades
4. **consultas**: Armazena agendamentos e relaciona pacientes com médicos

### Relacionamentos

- `consultas.paciente_id` → `pacientes.id` (FK)
- `consultas.medico_id` → `medicos.id` (FK)

### Status de Consultas

- **Agendada**: Consulta marcada, aguardando realização
- **Realizada**: Paciente compareceu e foi atendido
- **Faltou**: Paciente não compareceu

## 🔧 Conexão com o Banco de Dados

A conexão com o MySQL é estabelecida automaticamente através do SQLAlchemy no arquivo `app.py`:

```python
# Inicializar SQLAlchemy para conexão com MySQL
db = SQLAlchemy(app)
```

A string de conexão é configurada em `config.py`:

```python
SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
```

## 📝 Notas Importantes

### Segurança

⚠️ **ATENÇÃO**: Este sistema foi desenvolvido para fins educacionais/demonstrativos. Para uso em produção:

1. Implemente hash de senhas (bcrypt, argon2)
2. Use HTTPS (SSL/TLS)
3. Adicione validação CSRF
4. Implemente rate limiting
5. Use variáveis de ambiente para credenciais
6. Adicione logs de auditoria

### Melhorias Futuras

- [ ] Hash de senhas com bcrypt
- [ ] Validação de CPF e CNS
- [ ] Máscaras de input nos formulários
- [ ] Paginação nas listagens
- [ ] Filtros e busca avançada
- [ ] Exportação de relatórios (PDF)
- [ ] Sistema de notificações por email/SMS
- [ ] API REST para integração
- [ ] Testes automatizados
- [ ] Dark mode

## 🐛 Troubleshooting

### Erro de Conexão com MySQL

```
sqlalchemy.exc.OperationalError: (pymysql.err.OperationalError) (2003, "Can't connect to MySQL server")
```

**Solução**: Verifique se:
- O MySQL está rodando
- As credenciais em `config.py` estão corretas
- O banco `ubs_system` foi criado

### Erro de Importação

```
ModuleNotFoundError: No module named 'flask'
```

**Solução**: Instale as dependências:
```bash
pip install -r requirements.txt
```

### CSS/Logo não carregam

**Solução**: Verifique se:
- A pasta `static/` existe
- O arquivo `static/img/logo.png` está presente
- O Flask está servindo arquivos estáticos corretamente

## 📚 Documentação Adicional

- **[DESIGN_GUIDE.md](DESIGN_GUIDE.md)** - Guia completo do design system
- **[INSTRUCOES_DETALHADAS.md](INSTRUCOES_DETALHADAS.md)** - Tutorial passo a passo

## 📧 Suporte

Para dúvidas ou problemas, consulte a documentação:

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

## 📄 Licença

Este projeto é de código aberto e está disponível para uso educacional.

---

**Desenvolvido com ❤️ e design profissional para gestão eficiente de Unidades Básicas de Saúde**

🎨 **Design System**: Medical Blue  
🏥 **Branding**: UBS Digital  
💻 **Stack**: Python + Flask + MySQL + Bootstrap 5
=======
# UBS_Digital
![Imagem do WhatsApp de 2025-12-02 à(s) 16 41 51_e4020d0a](https://github.com/user-attachments/assets/fc818bda-903c-4cf3-8d7f-da2b54a92729)

