# Documento de Arquitetura de Software (DAS)

## [UBS-DIGITAL] – Sistema de Gestão de UBS

| Gestor do Projeto | Gerente de Projeto |
| :--- | :--- |
| [Nome do Gestor] | [Nome do Gerente] |
| [Email do Gestor] | [Email do Gerente] |

### Objetivo deste Documento

Este documento tem como objetivo descrever as principais decisões de projeto de arquitetura tomadas pela equipe de desenvolvimento e os critérios considerados durante a tomada destas decisões para o sistema **UBS Digital**. Suas informações incluem a parte de hardware e software do sistema, adotando a estrutura baseada na visão “4+1” de modelo de arquitetura.

### Histórico de Revisão

| Data | Demanda | Autor | Descrição | Versão |
| :--- | :--- | :--- | :--- | :--- |
| 30/11/2025 | [XX000001] | Manus AI | Criação da primeira versão do DAS, baseada no sistema funcional Flask/MySQL. | 1.0 |

---

## 1. INTRODUÇÃO

### 1.1 Finalidade

Este documento fornece uma visão arquitetural abrangente do sistema **UBS Digital**, usando diversas visões de arquitetura para representar diferentes aspectos do sistema. O objetivo é capturar e comunicar as decisões arquiteturais significativas que foram tomadas em relação ao sistema, que visa modernizar os serviços oferecidos pelas Unidades Básicas de Saúde (UBS) através da digitalização de processos.

### 1.2 Escopo

Este Documento de Arquitetura de Software se aplica ao sistema **UBS Digital**, que foi desenvolvido pela equipe de [Desenvolvimento Full Stack].

O UBS Digital consiste no desenvolvimento de um aplicativo web voltado à modernização dos serviços oferecidos pelas Unidades Básicas de Saúde (UBS). O projeto tem como finalidade promover maior acessibilidade, praticidade e eficiência no atendimento aos pacientes, por meio da digitalização de processos de agendamento e gestão de consultas. Visa não apenas melhorar a experiência do usuário (Paciente), mas também otimizar o fluxo de atendimento nas unidades de saúde (Recepcionista).

### 1.3 Definições, Acrônimos e Abreviações

| Termo | Definição |
| :--- | :--- |
| **UBS** | Unidade Básica de Saúde. |
| **DAS** | Documento de Arquitetura de Software. |
| **4+1** | Modelo de Arquitetura de Software (Kruchten). |
| **Flask** | Micro-framework web em Python, utilizado para o backend. |
| **SQLAlchemy** | Toolkit SQL e Mapeador Objeto-Relacional (ORM) utilizado para interagir com o banco de dados. |
| **MySQL** | Sistema de Gerenciamento de Banco de Dados Relacional (SGBDR) utilizado para persistência de dados. |
| **Jinja2** | Template engine utilizada pelo Flask para renderização do frontend (HTML/CSS). |
| **CNS** | Cartão Nacional de Saúde (Cartão SUS), requisito obrigatório para cadastro de pacientes. |
| **UI/UX** | User Interface / User Experience. |
| **Bootstrap 5** | Framework CSS utilizado para o design responsivo e profissional. |

### 1.4 Referências

| Referência | Descrição |
| :--- | :--- |
| [KRU41] | The “4+1” view model of software architecture, Philippe Kruchten, November 1995. |
| [QOS] | Quality of Service (Qualidade de Serviço). |
| [FLASK] | Documentação Oficial do Flask (https://flask.palletsprojects.com/). |
| [SQLA] | Documentação Oficial do SQLAlchemy (https://www.sqlalchemy.org/). |
| [MYSQL] | Documentação Oficial do MySQL (https://dev.mysql.com/doc/). |

---

## 2. REPRESENTAÇÃO ARQUITETURAL

Este documento irá detalhar as visões baseado no modelo “4+1” [KRU41]. As visões utilizadas no documento serão:

| Visão | Público | Área |
| :--- | :--- | :--- |
| **Lógica** | Analistas | Realização dos Casos de Uso, Estrutura de Classes/Modelos |
| **Processo** | Integradores | Performance, Escalabilidade, Concorrência (Fluxos de Execução) |
| **Implementação** | Programadores | Componentes de Software, Estrutura de Código |
| **Implantação** | Gerência de Configuração | Nodos físicos, Topologia de Servidores |
| **Caso de Uso** | Todos | Requisitos funcionais e Cenários |

---

## 3. REQUISITOS E RESTRIÇÕES ARQUITETURAIS

Esta seção descreve os requisitos de software e restrições que têm um impacto significante na arquitetura.

| Requisito | Solução |
| :--- | :--- |
| **Linguagem** | Python 3.x para o backend. |
| **Framework** | Flask (Micro-framework Python). |
| **Banco de Dados** | MySQL (SGBDR Relacional). |
| **ORM** | SQLAlchemy (Mapeador Objeto-Relacional). |
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla) e Bootstrap 5 (via Jinja2 templates). |
| **Plataforma** | Servidor de Aplicações WSGI (ex: Gunicorn, uWSGI) rodando em ambiente Linux (Ubuntu). |
| **Segurança** | Autenticação baseada em sessão (Flask Session). Senhas armazenadas em texto simples (restrição do MVP, deve ser migrado para Hash - bcrypt - em produção). |
| **Internacionalização (i18n)** | Não implementada no MVP. O sistema utiliza apenas o idioma Português (pt-BR). |
| **Restrição de Cadastro** | Apenas usuários com perfil **Recepcionista** podem cadastrar novos pacientes. |
| **Restrição de Dados** | O campo **Cartão SUS (CNS)** é obrigatório para o cadastro de pacientes. |
| **Restrição de Agendamento** | Pacientes só podem agendar consultas para datas futuras. |

---

## 4. VISÃO DE CASOS DE USO

A descrição de uma arquitetura é ilustrada usando um pequeno conjunto de casos de usos, ou cenários.

### Lista de Casos de Uso do Sistema

- **CU001: Autenticar Usuário** (Paciente ou Recepcionista)
- **CU002: Cadastrar Novo Paciente** (Apenas Recepcionista)
- **CU003: Agendar Consulta** (Apenas Paciente)
- **CU004: Visualizar Agenda de Consultas** (Apenas Recepcionista)
- **CU005: Atualizar Status da Consulta** (Apenas Recepcionista)
- **CU006: Visualizar Histórico de Consultas** (Apenas Paciente)

### 4.1 Casos de Uso Significantes para a Arquitetura

Os casos de uso mais significantes para a arquitetura são aqueles que envolvem a persistência de dados e a distinção de perfis de acesso.

#### Cenário 1: Cadastro de Paciente (Recepcionista)

1. **Ator:** Recepcionista.
2. **Fluxo:** Recepcionista acessa o dashboard, navega para a seção de cadastro, preenche os dados do paciente (incluindo CNS e senha), e submete o formulário.
3. **Arquitetura:** A rota `/recepcionista/cadastrar_paciente` verifica o `session['user_type']`. O modelo `Paciente` do SQLAlchemy é instanciado e o método `db.session.add()` e `db.session.commit()` são chamados para persistir os dados no MySQL.

#### Cenário 2: Agendamento de Consulta (Paciente)

1. **Ator:** Paciente.
2. **Fluxo:** Paciente acessa o dashboard, visualiza a lista de médicos, seleciona um médico e uma data/hora **futura**, e submete o agendamento.
3. **Arquitetura:** A rota `/paciente/agendar` verifica o `session['user_type']`. O sistema valida se a `data_hora` é maior que a data atual. O modelo `Consulta` é instanciado, ligando `paciente_id` e `medico_id` (Foreign Keys), e o status inicial é definido como 'Agendada'.

#### Cenário 3: Visualização do Histórico (Paciente)

1. **Ator:** Paciente.
2. **Fluxo:** Paciente acessa a aba "Histórico".
3. **Arquitetura:** A rota `/paciente/historico` executa uma consulta complexa no SQLAlchemy:
    - Filtra pelo `paciente_id` logado.
    - Filtra por `data_hora < datetime.now()` (apenas consultas passadas).
    - Filtra por `status IN ('Realizada', 'Faltou')` (apenas status definidos pelo recepcionista).
    - Realiza JOIN com a tabela `medicos` para exibir os detalhes.

---

## 5. VISÃO LÓGICA

Descreve uma visão lógica da arquitetura, as classes mais importantes, sua organização em pacotes de serviços e subsistemas, e a organização desses subsistemas em camadas.

### 5.1 Visão Geral – pacotes e camadas

A arquitetura lógica do UBS Digital segue o padrão **Model-View-Controller (MVC)**, adaptado ao contexto do Flask, que utiliza o padrão **Model-View-Template (MVT)**.

| Camada | Componentes | Descrição |
| :--- | :--- | :--- |
| **Apresentação (View/Template)** | `templates/`, `static/` | Responsável pela interface do usuário (HTML, CSS, JS). Utiliza Jinja2 para renderização dinâmica. |
| **Lógica de Negócio (Controller/Routes)** | `app.py` (Rotas) | Contém as rotas do Flask, a lógica de autenticação, validação de regras de negócio (ex: data futura, permissão de cadastro) e a coordenação entre as camadas. |
| **Acesso a Dados (Model/ORM)** | `app.py` (Classes de Modelo) | Mapeamento Objeto-Relacional (ORM) usando SQLAlchemy. Define as classes `Paciente`, `Recepcionista`, `Medico` e `Consulta`, que representam as tabelas do banco. |
| **Persistência (Database)** | MySQL | Armazenamento físico dos dados. |

### 5.2 Diagrama de Classes (Modelos de Dados)

O diagrama de classes reflete os modelos de dados definidos no `app.py` e no `schema.sql`.

| Classe | Atributos Chave | Relacionamentos |
| :--- | :--- | :--- |
| **Paciente** | id, nome, cpf, senha, **cns** | 1:N com Consulta |
| **Recepcionista** | id, login, senha, nome | N/A |
| **Medico** | id, nome, especialidade | 1:N com Consulta |
| **Consulta** | id, paciente_id, medico_id, data_hora, status | N:1 com Paciente, N:1 com Medico |

**Relacionamentos:**
- Um **Paciente** pode ter muitas **Consultas**.
- Um **Medico** pode ter muitas **Consultas**.
- Uma **Consulta** pertence a um **Paciente** e a um **Medico**.

### 5.3 Diagrama de Estado (Consulta)

O objeto `Consulta` possui um ciclo de vida bem definido, gerenciado principalmente pelo Recepcionista.

| Estado | Transição | Gatilho |
| :--- | :--- | :--- |
| **Agendada** | Compareceu | Recepcionista clica em "Compareceu" |
| **Agendada** | Faltou | Recepcionista clica em "Faltou" |
| **Realizada** | N/A | Estado final (Histórico) |
| **Faltou** | N/A | Estado final (Histórico) |

---

## 6. VISÃO DE IMPLEMENTAÇÃO

Descreve o sistema da perspectiva de um programador e está relacionada ao gerenciamento de software.

### 6.1 Diagrama de Componente

O sistema é composto por três componentes principais:

1. **Componente Frontend (Web Client):**
    - **Tecnologia:** HTML, CSS (Bootstrap 5), JavaScript, Jinja2 Templates.
    - **Função:** Renderiza a interface do usuário e envia requisições HTTP para o Backend.

2. **Componente Backend (Flask Application):**
    - **Tecnologia:** Python, Flask, SQLAlchemy.
    - **Função:** Contém a lógica de negócio, rotas, autenticação e a camada ORM. É o ponto central de processamento.

3. **Componente Persistência (MySQL Database):**
    - **Tecnologia:** MySQL.
    - **Função:** Armazena os dados de forma relacional e segura.

**Interações:**
- O **Web Client** se comunica com o **Flask Application** via HTTP (GET/POST).
- O **Flask Application** se comunica com o **MySQL Database** via driver PyMySQL e SQLAlchemy.

---

## 7. VISÃO DE PROCESSOS

A visão do processo lida com os aspectos dinâmicos do sistema, explicando os processos e como eles se comunicam.

### 7.1 Diagrama de Sequência (Exemplo: Atualização de Status)

| Participante | Ação |
| :--- | :--- |
| **Recepcionista** | 1. Acessa Dashboard (GET /recepcionista/dashboard) |
| **Flask (Rotas)** | 2. Verifica autenticação e tipo de usuário (Recepcionista) |
| **SQLAlchemy (ORM)** | 3. Consulta todas as Consultas e Pacientes (SELECT * FROM consultas JOIN pacientes) |
| **Flask (Rotas)** | 4. Renderiza `dashboard_recepcionista.html` com a lista de consultas |
| **Recepcionista** | 5. Clica no botão "Compareceu" para Consulta ID #X (GET /recepcionista/atualizar_status/X/Realizada) |
| **Flask (Rotas)** | 6. Recebe a requisição e busca a Consulta #X no banco |
| **SQLAlchemy (ORM)** | 7. Atualiza o campo `status` para 'Realizada' e commita a transação (UPDATE consultas SET status='Realizada' WHERE id=X) |
| **Flask (Rotas)** | 8. Redireciona para o Dashboard com mensagem de sucesso |

### 7.2 Diagrama de Atividade (Exemplo: Login Unificado)

1. **Início**
2. **Atividade:** Usuário acessa `/login`
3. **Decisão:** Tipo de Usuário?
    - **Se Paciente:**
        - **Atividade:** Buscar Paciente por CPF e Senha
        - **Decisão:** Encontrado?
            - **Sim:** Criar Sessão (user_type='paciente') -> Redirecionar para Dashboard Paciente
            - **Não:** Exibir Mensagem de Erro -> Voltar para Login
    - **Se Recepcionista:**
        - **Atividade:** Buscar Recepcionista por Login e Senha
        - **Decisão:** Encontrado?
            - **Sim:** Criar Sessão (user_type='recepcionista') -> Redirecionar para Dashboard Recepcionista
            - **Não:** Exibir Mensagem de Erro -> Voltar para Login
4. **Fim**

---

## 8. VISÃO DE IMPLANTAÇÃO

Descreve o sistema do ponto de vista de um engenheiro de sistemas, preocupando-se com a topologia dos componentes de software na camada física.

### 8.1 Diagrama de Implantação

| Nodo | Componentes | Descrição |
| :--- | :--- | :--- |
| **NODO 1: Cliente (Navegador)** | HTML, CSS, JS, Bootstrap 5 | Qualquer dispositivo com navegador web (Desktop, Mobile, Tablet). |
| **NODO 2: Servidor de Aplicação (Linux)** | **Sistema Operacional:** Ubuntu/Linux<br>**Servidor Web:** Gunicorn/uWSGI<br>**Aplicação:** Python 3.x, Flask, SQLAlchemy, PyMySQL | Servidor onde a aplicação Flask está hospedada. Recebe requisições HTTP e processa a lógica de negócio. |
| **NODO 3: Servidor de Banco de Dados (Linux)** | **Sistema Operacional:** Ubuntu/Linux<br>**SGBDR:** MySQL Server | Servidor dedicado ou co-localizado para persistência de dados. |

**Conexões:**
- **Cliente** <-> **Servidor de Aplicação:** HTTP/HTTPS (Porta 80/443)
- **Servidor de Aplicação** <-> **Servidor de Banco de Dados:** TCP/IP (Porta 3306)

---

## 9. DIMENSIONAMENTO E PERFORMANCE

### 9.1 Volume

| Item | Valor Estimado |
| :--- | :--- |
| **Número estimado de usuários (Pacientes)** | 5.000 |
| **Número estimado de usuários (Recepcionistas)** | 10 |
| **Número estimado de acessos diários** | 500 |
| **Número estimado de consultas agendadas (Total)** | 10.000 |
| **Tempo de sessão de um usuário** | 30 minutos |

### 9.2 Performance

| Item | Resposta Esperada |
| :--- | :--- |
| **Tempo máximo para Login** | < 500 ms |
| **Tempo máximo para Cadastro de Paciente** | < 800 ms |
| **Tempo máximo para Agendamento de Consulta** | < 1.000 ms |
| **Tempo máximo para Visualização da Agenda (Recepcionista)** | < 1.500 ms (considerando grande volume de dados) |

---

## 10. QUALIDADE

Enumerar os itens de qualidade de software [QOS] significativos para a aplicação:

| Item | Descrição | Solução |
| :--- | :--- | :--- |
| **Escalabilidade** | Capacidade de o sistema crescer e lidar com um aumento de demanda sem perda significativa de desempenho. | **Solução:** Arquitetura de 3 camadas (Web/App/DB) desacoplada. O Flask é leve e pode ser facilmente escalado horizontalmente com balanceadores de carga (Load Balancers) e múltiplos workers Gunicorn/uWSGI. O MySQL pode ser configurado com réplicas de leitura. |
| **Confiabilidade, Disponibilidade** | Capacidade de o sistema funcionar corretamente e consistentemente ao longo do tempo, mesmo diante de falhas. | **Solução:** Uso de SGBDR (MySQL) com transações ACID. Uso de ORM (SQLAlchemy) para abstração e tratamento de erros de banco. Uso de servidor de aplicação robusto (Gunicorn/uWSGI) com reinicialização automática de workers em caso de falha. |
| **Portabilidade** | Capacidade de o sistema ser executado em diferentes ambientes com pouca ou nenhuma modificação. | **Solução:** Uso de Python e Flask, que são multi-plataforma. O projeto pode ser facilmente empacotado em contêineres Docker, garantindo que o ambiente de desenvolvimento, teste e produção sejam idênticos. |
| **Segurança** | Conjunto de práticas e mecanismos usados para proteger dados, recursos e operações. | **Solução:** Autenticação baseada em sessão. Uso de prepared statements (via SQLAlchemy) para prevenir SQL Injection. Validação de regras de negócio (ex: permissão de Recepcionista para cadastro). **Melhoria Futura:** Implementação de Hash de Senhas (bcrypt) e HTTPS. |

---

## 11. MUDANÇAS REALIZADAS NA PRIMEIRA VERSÃO DO SOFTWARE (MVP) DURANTE O DESENVOLVIMENTO DO PROJETO DE ARQUITETURA

| Data | Descrição da Mudança | Impacto na Arquitetura |
| :--- | :--- | :--- |
| 30/11/2025 | Refatoração completa da interface de usuário (UI/UX) para um design profissional "Medical Blue". | **Visão de Implementação/Lógica:** Nenhuma alteração no backend (Python/Flask/SQLAlchemy). **Visão de Apresentação:** Migração total para Bootstrap 5, Bootstrap Icons e CSS customizado profissional. |
| 30/11/2025 | Adição do campo **Cartão SUS (CNS)** como obrigatório no cadastro de pacientes. | **Visão Lógica/Acesso a Dados:** Adição da coluna `cns` na tabela `pacientes` com restrição `NOT NULL UNIQUE`. Lógica de validação adicionada na rota de cadastro do Recepcionista. |
| 30/11/2025 | Implementação de filtro no Histórico do Paciente para mostrar apenas consultas com status 'Realizada' ou 'Faltou'. | **Visão Lógica/Acesso a Dados:** Criação de uma query complexa no SQLAlchemy para aplicar filtros de data (`data_hora < NOW()`) e status (`status IN (...)`). |

---

**FIM DO DOCUMENTO**
