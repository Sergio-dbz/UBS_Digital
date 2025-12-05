# 📚 INSTRUÇÕES DETALHADAS - Sistema UBS

## 🎯 Como Executar o Sistema Passo a Passo

### PASSO 1: Preparar o Ambiente

#### 1.1 Verificar Python Instalado

Abra o terminal/prompt de comando e execute:

```bash
python --version
```

Deve mostrar Python 3.8 ou superior. Se não tiver, baixe em: https://www.python.org/downloads/

#### 1.2 Verificar MySQL Instalado

Abra o MySQL Workbench ou execute no terminal:

```bash
mysql --version
```

Se não tiver MySQL instalado, baixe em: https://dev.mysql.com/downloads/mysql/

---

### PASSO 2: Criar o Banco de Dados

#### Opção A: Usando MySQL Workbench (Recomendado)

1. **Abra o MySQL Workbench**
2. **Conecte-se ao servidor MySQL** (geralmente localhost)
3. **Abra o arquivo SQL**:
   - Menu: File → Open SQL Script
   - Navegue até: `ubs_system/database/schema.sql`
4. **Execute o script**:
   - Clique no ícone de raio ⚡ (Execute)
   - Ou pressione: `Ctrl + Shift + Enter`
5. **Verifique a criação**:
   - No painel esquerdo, clique em "Schemas"
   - Você deve ver o banco `ubs_system` com 4 tabelas

#### Opção B: Usando Linha de Comando

```bash
# Entre no MySQL
mysql -u root -p

# Digite sua senha quando solicitado
# Depois, execute:

SOURCE /caminho/completo/para/ubs_system/database/schema.sql;

# Verifique se foi criado:
SHOW DATABASES;
USE ubs_system;
SHOW TABLES;
```

---

### PASSO 3: Instalar Dependências Python

#### 3.1 Navegue até a pasta do projeto

```bash
cd /caminho/para/ubs_system
```

#### 3.2 (Opcional) Criar ambiente virtual

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

#### 3.3 Instalar pacotes necessários

```bash
pip install -r requirements.txt
```

Aguarde a instalação dos pacotes:
- Flask
- Flask-SQLAlchemy
- PyMySQL
- cryptography

---

### PASSO 4: Configurar Credenciais do Banco

#### 4.1 Abra o arquivo `config.py`

Use qualquer editor de texto (VSCode, Notepad++, etc.)

#### 4.2 Localize a seção de configuração do banco:

```python
DB_HOST = os.environ.get('DB_HOST') or 'localhost'
DB_PORT = os.environ.get('DB_PORT') or '3306'
DB_USER = os.environ.get('DB_USER') or 'root'
DB_PASSWORD = os.environ.get('DB_PASSWORD') or ''  # COLOQUE SUA SENHA AQUI
DB_NAME = os.environ.get('DB_NAME') or 'ubs_system'
```

#### 4.3 Ajuste os valores conforme seu MySQL:

**Exemplo:**
```python
DB_PASSWORD = os.environ.get('DB_PASSWORD') or 'minhasenha123'
```

⚠️ **IMPORTANTE**: Substitua `'minhasenha123'` pela senha do seu MySQL!

#### 4.4 Salve o arquivo

---

### PASSO 5: Executar a Aplicação

#### 5.1 No terminal, execute:

```bash
python app.py
```

#### 5.2 Você verá algo assim:

```
 * Serving Flask app 'app'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment.
 * Running on http://0.0.0.0:5000
Press CTRL+C to quit
```

#### 5.3 Abra o navegador e acesse:

```
http://localhost:5000
```

---

## 🔐 Como Usar o Sistema

### CENÁRIO 1: Login como Recepcionista

1. **Acesse**: http://localhost:5000
2. **Clique na aba**: "Recepcionista"
3. **Digite as credenciais**:
   - Login: `recep01`
   - Senha: `senha123`
4. **Clique em**: "Entrar como Recepcionista"

#### O que você pode fazer:

✅ **Cadastrar Novo Paciente**
- Clique na aba "Cadastrar Paciente"
- Preencha todos os campos obrigatórios (*)
- **IMPORTANTE**: O Cartão SUS (CNS) deve ter 15 dígitos
- Clique em "Cadastrar Paciente"

✅ **Visualizar Agenda**
- Clique na aba "Agenda de Consultas"
- Veja todas as consultas do sistema

✅ **Atualizar Status de Consulta**
- Na agenda, localize uma consulta com status "Agendada"
- Clique em:
  - **"✓ Compareceu"**: Se o paciente veio
  - **"✗ Faltou"**: Se o paciente não compareceu
- Confirme a ação

✅ **Ver Lista de Pacientes**
- Clique na aba "Lista de Pacientes"
- Veja todos os pacientes cadastrados

---

### CENÁRIO 2: Login como Paciente

1. **Acesse**: http://localhost:5000
2. **Clique na aba**: "Paciente"
3. **Digite as credenciais**:
   - CPF: `123.456.789-00`
   - Senha: `paciente123`
4. **Clique em**: "Entrar como Paciente"

#### O que você pode fazer:

✅ **Agendar Consulta**
- Na aba "Agendar Consulta"
- Escolha um médico no menu dropdown
- Selecione data e hora (deve ser futura!)
- Clique em "Agendar Consulta"

✅ **Ver Consultas Agendadas**
- Clique na aba "Minhas Consultas"
- Veja todas as suas consultas futuras

✅ **Ver Histórico**
- Clique na aba "Histórico"
- Clique em "Ver Histórico Completo"
- Veja apenas consultas passadas com status definido pelo recepcionista

---

## 🧪 Testando o Fluxo Completo

### Teste 1: Cadastrar Paciente e Agendar Consulta

1. **Login como Recepcionista** (`recep01` / `senha123`)
2. **Cadastre um novo paciente**:
   - Nome: João da Silva
   - CPF: 111.222.333-44
   - Senha: teste123
   - CNS: 111222333444555
   - Telefone: (11) 99999-9999
   - Data Nascimento: 01/01/1990
3. **Faça logout**
4. **Login como Paciente** (`111.222.333-44` / `teste123`)
5. **Agende uma consulta** para amanhã às 10:00
6. **Verifique** em "Minhas Consultas"

### Teste 2: Atualizar Status e Ver Histórico

1. **Login como Recepcionista**
2. **Vá para "Agenda de Consultas"**
3. **Encontre uma consulta passada** (veja os dados de teste)
4. **Clique em "✓ Compareceu"**
5. **Faça logout**
6. **Login como o Paciente** dessa consulta
7. **Vá para "Histórico"**
8. **Verifique** que a consulta aparece com status "Realizada"

---

## 📊 Dados de Teste Incluídos

### Recepcionistas (2)

| ID | Login   | Senha    | Nome         |
|----|---------|----------|--------------|
| 1  | recep01 | senha123 | Maria Silva  |
| 2  | recep02 | senha456 | João Santos  |

### Pacientes (2)

| ID | Nome              | CPF             | Senha       | CNS             |
|----|-------------------|-----------------|-------------|-----------------|
| 1  | Carlos Oliveira   | 123.456.789-00  | paciente123 | 123456789012345 |
| 2  | Ana Paula Costa   | 987.654.321-00  | paciente456 | 987654321098765 |

### Médicos (4)

| ID | Nome                | Especialidade    | CRM          |
|----|---------------------|------------------|--------------|
| 1  | Dr. Roberto Almeida | Clínico Geral    | CRM-SP 123456|
| 2  | Dra. Fernanda Lima  | Pediatria        | CRM-SP 234567|
| 3  | Dr. Paulo Mendes    | Cardiologia      | CRM-SP 345678|
| 4  | Dra. Juliana Rocha  | Ginecologia      | CRM-SP 456789|

### Consultas (5)

**Passadas:**
- Carlos com Dr. Roberto (15/11/2024 09:00) - Status: Realizada
- Carlos com Dr. Paulo (20/11/2024 14:30) - Status: Faltou
- Ana com Dra. Fernanda (18/11/2024 10:00) - Status: Realizada

**Futuras:**
- Carlos com Dra. Fernanda (05/12/2025 11:00) - Status: Agendada
- Ana com Dr. Roberto (10/12/2025 15:00) - Status: Agendada

---

## 🔍 Verificando os Dados no MySQL

### Ver todos os pacientes:

```sql
USE ubs_system;
SELECT * FROM pacientes;
```

### Ver todas as consultas com detalhes:

```sql
SELECT 
    c.id, 
    p.nome AS paciente, 
    m.nome AS medico, 
    m.especialidade, 
    c.data_hora, 
    c.status
FROM consultas c
JOIN pacientes p ON c.paciente_id = p.id
JOIN medicos m ON c.medico_id = m.id
ORDER BY c.data_hora DESC;
```

### Ver histórico de um paciente específico:

```sql
SELECT 
    c.id, 
    m.nome AS medico, 
    m.especialidade, 
    c.data_hora, 
    c.status
FROM consultas c
JOIN medicos m ON c.medico_id = m.id
WHERE c.paciente_id = 1 
  AND c.data_hora < NOW()
  AND c.status IN ('Realizada', 'Faltou')
ORDER BY c.data_hora DESC;
```

---

## ⚠️ Problemas Comuns e Soluções

### Problema 1: "Can't connect to MySQL server"

**Causa**: MySQL não está rodando ou credenciais incorretas

**Solução**:
1. Verifique se o MySQL está rodando
2. Abra o MySQL Workbench e teste a conexão
3. Verifique as credenciais em `config.py`

### Problema 2: "ModuleNotFoundError: No module named 'flask'"

**Causa**: Dependências não instaladas

**Solução**:
```bash
pip install -r requirements.txt
```

### Problema 3: "Table doesn't exist"

**Causa**: Banco de dados não foi criado

**Solução**:
1. Execute o arquivo `schema.sql` no MySQL Workbench
2. Verifique se o banco `ubs_system` existe

### Problema 4: "Login inválido"

**Causa**: Credenciais incorretas ou banco vazio

**Solução**:
1. Verifique se usou as credenciais corretas (veja tabela acima)
2. Confirme que o script SQL foi executado completamente
3. Execute no MySQL:
   ```sql
   SELECT * FROM recepcionistas;
   SELECT * FROM pacientes;
   ```

### Problema 5: Página não carrega (localhost:5000)

**Causa**: Aplicação não está rodando

**Solução**:
1. Verifique se executou `python app.py`
2. Veja se há erros no terminal
3. Tente acessar: `http://127.0.0.1:5000`

---

## 🎓 Entendendo o Código

### Onde a Conexão com o Banco é Feita

**Arquivo**: `app.py`

**Linha 13-14**:
```python
# Inicializar SQLAlchemy para conexão com MySQL
db = SQLAlchemy(app)
```

**Arquivo**: `config.py`

**Linha 24**:
```python
SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
```

### Fluxo de Autenticação

**Arquivo**: `app.py` - Função `login()` (linha 84)

1. Recebe usuário e senha do formulário
2. Verifica o tipo (paciente ou recepcionista)
3. Busca no banco de dados usando SQLAlchemy
4. Se encontrar, cria sessão e redireciona
5. Se não encontrar, mostra erro

### Como as Consultas são Filtradas

**Histórico do Paciente** (linha 184):
```python
historico = Consulta.query.filter(
    Consulta.paciente_id == paciente_id,
    Consulta.data_hora < datetime.now(),  # Apenas passadas
    Consulta.status.in_(['Realizada', 'Faltou'])  # Apenas com status definido
).order_by(Consulta.data_hora.desc()).all()
```

---

## 📞 Precisa de Ajuda?

Se encontrar problemas:

1. ✅ Verifique se seguiu todos os passos
2. ✅ Leia as mensagens de erro com atenção
3. ✅ Consulte a seção "Problemas Comuns"
4. ✅ Verifique os logs no terminal onde rodou `python app.py`

---

**Boa sorte com seu Sistema UBS! 🏥**
