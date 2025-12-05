# Documento de Arquitetura de Software (DAS) - UBS DIGITAL

**Poder Executivo**
**Ministério da Educação**
**Universidade Federal do Amazonas**
**Instituto de Ciências Exatas e Tecnologia**

## Gestão do Projeto

| Função | Nome | Contato |
| :--- | :--- | :--- |
| **Gestor do Projeto** | Anacilia Vieira | anaciliacavalcante@ufam.edu.br |
| **Gerente de Projeto** | Sérgio Fernandes Mar Filho | sergiofilho0615@gmail.com |

## Objetivo deste Documento

Este documento tem como objetivo descrever as principais decisões de projeto de arquitetura tomadas pela equipe de desenvolvimento e os critérios considerados durante a tomada destas decisões para o sistema **UBS Digital**. Suas informações incluem a parte de hardware e software do sistema.

## Histórico de Revisão

| Data | Demanda | Autor | Descrição | Versão |
| :--- | :--- | :--- | :--- | :--- |
| 25/10/2025 | Inclusão dos Casos de Uso | Ivonete Balieiro de Almeida | Adicionar a lista dos Casos de Uso (001 a 009). | 1.0 |
| 26/10/2025 | Inserção da Visão Lógica | Sérgio Fernandes Mar Filho | Inclusão do diagrama Casos de Uso significantes para a arquitetura | 1.0 |
| 27/10/2025 | Inserção da Visão Lógica | Sérgio Fernandes Mar Filho | Visão Geral – pacotes e camadas | 1.0 |
| 29/10/2025 | Inserção da Visão Lógica | Sérgio Fernandes Mar Filho | Inclusão do Diagrama de Classes | 1.0 |
| 29/10/2025 | Inserção da Visão Lógica | Ivonete Balieiro de Almeida | Inclusão Diagrama de Estado | 1.0 |
| 30/10/2025 | Inserção da Visão Lógica | Ivonete Balieiro de Almeida | Inclusão do Diagrama de Componentes | 1.0 |
| 05/11/2025 | Inserção Visão Lógica | Kaylane Soares Vieira | Inclusão do Diagrama de Sequência | 1.0 |
| 05/11/2025 | Inserção Visão Lógica | Kaylane Soares Vieira | Inclusão do Diagrama de Atividade | 1.0 |
| 06/11/2025 | Inclusão Visão Lógica | Marcos Correa Alves | Inclusão do diagrama de Implantação | 1.0 |

---

## Sumário

1.  [INTRODUÇÃO](#1-introdução)
    1.1. [Finalidade](#11-finalidade)
    1.2. [Escopo](#12-escopo)
    1.3. [Definições, Acrônimos e Abreviações](#13-definições-acrônimos-e-abreviações)
    1.4. [Referências](#14-referências)
2.  [REPRESENTAÇÃO ARQUITETURAL](#2-representação-arquitetural)
3.  [REQUISITOS E RESTRIÇÕES ARQUITETURAIS](#3-requisitos-e-restrições-arquiteturais)
4.  [VISÃO DE CASOS DE USO](#4-visão-de-casos-de-uso)
    4.1. [Casos de Uso significantes para a arquitetura](#41-casos-de-uso-significantes-para-a-arquitetura)
5.  [VISÃO LÓGICA](#5-visão-lógica)
    5.1. [Visão Geral – pacotes e camadas](#51-visão-geral--pacotes-e-camadas)
    5.2. [Diagrama de Classes](#52-diagrama-de-classes)
    5.3. [Diagrama de Estado](#53-diagrama-de-estado)
6.  [VISÃO DE IMPLEMENTAÇÃO](#6-visão-de-implementação)
    6.1. [Diagrama de Componente](#61-diagrama-de-componente)
7.  [VISÃO DE PROCESSOS](#7-visão-de-processos)
    7.1. [Diagrama de Sequência](#71-diagrama-de-sequência)
    7.2. [Diagrama de Atividade](#72-diagrama-de-atividade)
8.  [VISÃO DE IMPLANTAÇÃO](#8-visão-de-implantação)
    8.1. [Diagrama de implantação](#81-diagrama-de-implantação)
9.  [DIMENSIONAMENTO E PERFORMANCE](#9-dimensionamento-e-performance)
    9.1. [Volume](#91-volume)
    9.2. [Performance](#92-performance)
10. [QUALIDADE](#10-qualidade)
11. [MUDANÇAS REALIZADAS NA PRIMEIRA VERSÃO DO SOFTWARE (MVP) DURANTE O DESENVOLVIMENTO DO PROJETO DE ARQUITETURA](#11-mudanças-realizadas-na-primeira-versão-do-software-mvp-durante-o-desenvolvimento-do-projeto-de-arquitetura)

---

# 1. INTRODUÇÃO

## 1.1 Finalidade

Este documento fornece uma visão arquitetural abrangente do sistema **UBSdigital**, usando diversas visões de arquitetura para representar diferentes aspectos do sistema. O objetivo deste documento é capturar e comunicar as decisões arquiteturais significativas que foram tomadas em relação ao sistema que visa modernizar os serviços oferecidos pelas Unidades Básicas de Saúde (UBS) através da digitalização de processos. O documento irá adotar uma estrutura baseada na visão **“4+1” de modelo de arquitetura** [KRU41].

> **Figura 1 – Arquitetura 4+1**
> ![Imagem do WhatsApp de 2025-12-05 à(s) 13 15 02_f318c171](https://github.com/user-attachments/assets/75cba69e-3287-4343-8847-5cda3b93ffff)


## 1.2 Escopo

Este Documento de Arquitetura de Software se aplica ao sistema **UBS Digital**, que será desenvolvido pela equipe de [Desenvolvimento Full Stack].

O UBS Digital consiste no desenvolvimento de um aplicativo web voltado à modernização dos serviços oferecidos pelas Unidades Básicas de Saúde (UBS). O projeto tem como finalidade promover maior acessibilidade, praticidade e eficiência no atendimento aos pacientes, por meio da digitalização de processos de agendamento e gestão de consultas. Visa não apenas melhorar a experiência do usuário (Paciente), mas também otimizar o fluxo de atendimento nas unidades de saúde (Recepcionista).

O público-alvo são os pacientes e recepcionistas de Unidades Básicas de Saúde. Os *stakeholders* relacionados incluem gestores de saúde, médicos e a equipe de desenvolvimento e manutenção do sistema.

## 1.3 Definições, Acrônimos e Abreviações

| Termo | Definição |
| :--- | :--- |
| **UBS** | Unidade Básica de Saúde |
| **DAS** | Documentação de Arquitetura de Software |
| **4+1** | Modelo de Arquitetura de Software |
| **Flask** | Micro-framework web em Python, utilizado para backend. |
| **SQLAlchemy** | Toolkit SQL e Mapeador Objeto-Relacional (ORM) utilizado para interagir com o banco de dados. |
| **MySQL** | Sistema de Gerenciamento de Banco de Dados Relacional (SGBDR) utilizado para persistência de dados. |
| **Jinja2** | Template engine utilizada pelo Flask para renderização do frontend (HTML/CSS). |
| **CNS** | Cartão Nacional de Saúde (Cartão SUS), requisito obrigatório para cadastro de pacientes. |
| **UI/UX** | User Interface / User Experience. |
| **Bootstrap 5** | Framework CSS utilizado para o design responsivo e profissional. |
| **QoS** | Quality of Service (Qualidade de Serviço). Termo utilizado para descrever os requisitos não-funcionais de um sistema, como performance, disponibilidade e escalabilidade. |

## 1.4 Referências

*   **[KRU41]**: The “4+1” view model of software architecture, Philippe Kruchten, November 1995.
*   **[QOS]**: Documentação Oracle sobre Quality of Service.

# 2. REPRESENTAÇÃO ARQUITETURAL

Este documento irá detalhar as visões baseado no modelo “4+1” [KRU41]. As visões utilizadas no documento serão:

| Visão | Público | Área |
| :--- | :--- | :--- |
| **Lógica** | Analistas | Realização dos Casos de Uso |
| **Processo** | Integradores | Performance, Escalabilidade, Concorrência |
| **Implementação** | Programadores | Componentes de Software, Estrutura de Código |
| **Implantação** | Gerência de Configuração | Nodos físicos, Topologia de Servidores |
| **Caso de Uso** | Todos | Requisitos funcionais e Cenários |

> **Tabela 1 – Visões, Público e Área**

# 3. REQUISITOS E RESTRIÇÕES ARQUITETURAIS

Esta seção descreve os requisitos de software e restrições que têm um impacto significante na arquitetura.

| Requisito | Solução |
| :--- | :--- |
| **Linguagem** | Usaremos python para o backend. |
| **Plataforma** | Servidor de aplicação WSGI (ex: Gunicorn) rodando em ambiente Windows. O frontend é uma aplicação web padrão (HTML/CSS/JS) renderizado no servidor. |
| **Framework** | Flask (Micro-framework Python). |
| **Banco de Dados** | MySQL (SGBDR Relacional). |
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla) e Bootstrap5 (via Jinja2 templates.) |
| **Segurança** | Autenticação baseada em sessão (Flask Session). Senhas armazenadas em texto simples (restrição do MVP, deve ser migrado para Hash - bcrypt - em produção). |
| **Internacionalização (i18n)** | Não implementado no MVP. O sistema utiliza apenas o idioma Português (pt-BR). |

> **Tabela 2 – Exemplo de requisitos e restrições**

# 4. VISÃO DE CASOS DE USO

A descrição de uma arquitetura é ilustrada usando um pequeno conjunto de casos de usos, ou cenários. Os cenários descrevem sequências de interações entre objetos e entre processos. Eles são usados para identificar elementos arquitetônicos e para ilustrar e validar o design da arquitetura. Eles também servem como um ponto de partida para testes de um protótipo de arquitetura.

**Lista de casos de uso do sistema:**

*   **Caso de Uso [001]:** Autenticar Usuário (Paciente ou Recepcionista)
*   **Caso de Uso [002]:** Cadastrar Novo Paciente (Apenas Recepcionista)
*   **Caso de Uso [003]:** Agendar Consulta (Apenas paciente)
*   **Caso de Uso [004]:** Visualizar Consultas Agendadas (Apenas paciente)
*   **Caso de Uso [005]:** Visualizar Histórico de Consultas (Apenas paciente)
*   **Caso de Uso [006]:** Visualizar Agenda Completa de consultas (Apenas Recepcionista)
*   **Caso de Uso [007]:** Atualizar Status de Consulta (Apenas Recepcionista)
*   **Caso de Uso [008]:** Listar Pacientes Cadastrado (Apenas Recepcionista)
*   **Caso de Uso [009]:** Visualizar Médicos Disponíveis (Apenas Paciente)

## 4.1 Casos de Uso significantes para a arquitetura

> **Figura 2 – Exemplo de Diagrama com os casos de uso significativos e atores**
> <img width="800" height="711" alt="01_casos_de_uso 1" src="https://github.com/user-attachments/assets/422ff8a2-9833-41c7-8b34-227c672d2c79" />


# 5. VISÃO LÓGICA

Descreve uma visão lógica da arquitetura, as classes mais importantes, sua organização em pacotes de serviços e subsistemas, e a organização desses subsistemas em camadas. Também descreve as realizações dos casos de uso mais importantes, por exemplo, aspectos dinâmicos da arquitetura. Diagrama de classes e diagrama de estado devem ser incluídos para ilustrar os relacionamentos entre as classes significativas na arquitetura, subsistemas, pacotes e camadas.

## 5.1 Visão Geral – pacotes e camadas

> **Figura 3 – Exemplo de Diagrama de Camadas da Aplicação**
> <img width="875" height="766" alt="diagrama_camadas_web_only" src="https://github.com/user-attachments/assets/33fc466c-958a-4895-9a47-97ebeaeda2f1" />


## 5.2 Diagrama de Classes

> **Figura 4 – Exemplo de Diagrama de Classes**
> <img width="682" height="798" alt="02_classes 1" src="https://github.com/user-attachments/assets/8a72cbae-5e5d-490b-863a-e8d8625890db" />


## 5.3 Diagrama de Estado

> **Figura 5 – Exemplo de Diagrama de Estado**
> <img width="966" height="707" alt="diagrama_estados_consulta_limite1" src="https://github.com/user-attachments/assets/ff254ea4-4e43-4467-bd36-0768c4866862" />


# 6. VISÃO DE IMPLEMENTAÇÃO

Descreve o sistema da perspectiva de um programador e está relacionada ao gerenciamento de software. Os diagramas UML usados para representar a visão de desenvolvimento incluem o diagrama de componente.

## 6.1 Diagrama de Componente

> **Figura 6 – Exemplo de Diagrama de Componente**
> <img width="850" height="874" alt="07_componentes 1" src="https://github.com/user-attachments/assets/cf1abb07-d883-46d8-92e7-3642780fe6c2" />


# 7. VISÃO DE PROCESSOS

A visão do processo lida com os aspectos dinâmicos do sistema, explica os processos do sistema e como eles se comunicam, e foca no comportamento do tempo de execução do sistema. A visão do processo aborda simultaneidade, distribuição, integrador, desempenho e escalabilidade, etc. Os diagramas UML para representar a visão do processo incluem o diagrama de sequência e diagrama de atividade.

## 7.1 Diagrama de Sequência

> **Figura 7 – Exemplo de Diagrama de Sequência**
> <img width="800" height="874" alt="07_componentes 1" src="https://github.com/user-attachments/assets/44d6eaa5-4cf2-4963-9f1c-812dd8914b21" />




## 7.2 Diagrama de Atividade

> **Figura 8 – Exemplo de Diagrama de Atividade**
> <img width="800" height="874" alt="07_componentes 1" src="https://github.com/user-attachments/assets/5271e85c-f7f0-4031-b407-792b497ca68d" />

# 8. VISÃO DE IMPLANTAÇÃO

Descreve o sistema do ponto de vista de um engenheiro de sistemas. Se preocupa com a topologia dos componentes de software na camada física, bem como com as conexões físicas entre esses componentes. Os diagramas UML usados para representar a visão física incluem o diagrama de implantação.

## 8.1 Diagrama de implantação

> **Figura 6 – Exemplo de Diagrama de Implantação Java**
> <img width="646" height="1271" alt="08_implantacao 1" src="https://github.com/user-attachments/assets/d8570b05-443b-4678-9eb6-06bc73d56cd7" />


# 9. DIMENSIONAMENTO E PERFORMANCE

## 9.1 Volume

Itens relativos ao volume de acesso aos recursos da aplicação:

*   Número estimado de usuários: **8.024**
*   Número estimado de acessos diários: **150**
*   Número estimado de acessos por período: **1000 / semana**
*   Tempo de sessão de um usuário: **15 minutos**

## 9.2 Performance

Itens referentes à resposta esperada do sistema:

*   Login (Autenticação): **3 segundos**
*   Carregamento da Página Inicial (Dashboard): **3 segundos**
*   Efetivar Agendamento: **4 segundos**
*   Visualizar Histórico de Consultas: **2 segundos**
*   Carregar Perfil do Usuário: **2 segundos**

# 10. QUALIDADE

Itens de qualidade de software [QOS] significativos para a aplicação:

| Item | Descrição | Solução |
| :--- | :--- | :--- |
| **Escalabilidade** | Capacidade de um sistema crescer e lidar com um aumento de demanda - seja de usuários, dados ou requisições - sem perda significativa de desempenho, disponibilidade ou eficiência. | A arquitetura utiliza componentes desacoplados (servidor web, aplicação, banco de dados), permitindo escalonamento horizontal de cada camada de forma independente. O uso de um balanceador de carga (Nginx) pode distribuir o tráfego entre múltiplas instâncias da aplicação Flask. |
| **Confiabilidade, Disponibilidade** | Capacidade de um sistema funcionar corretamente e consistentemente ao longo do tempo, mesmo diante de falhas, altos volumes de uso ou condições inesperadas. | O sistema pode ser implantado em uma configuração de alta disponibilidade com replicação de banco de dados (Master-Slave) e múltiplas instâncias do servidor de aplicação. Ferramentas de monitoramento podem ser usadas para detectar falhas e reiniciar serviços automaticamente. |
| **Portabilidade** | Capacidade de um sistema ser executado em diferentes ambientes, plataformas ou dispositivos com pouca ou nenhuma modificação no código-fonte. | O uso de Python e tecnologias web padrão (HTML/CSS/JS) garante alta portabilidade. A aplicação pode ser executada em qualquer sistema operacional que suporte Python e MySQL. A conteinerização com pode abstrair completamente o ambiente de execução, garantindo Portabilidade máxima. |
| **Segurança** | É o conjunto de práticas, técnicas e mecanismos usados para proteger dados, recursos e operações contra acessos não autorizados, falhas, ataques e vazamentos. | A segurança é tratada através de sessões seguras no Flask, validação de entrada e parametrização de consultas SQL (via SQLAlchemy) para prevenir SQL Injection. Para produção, recomenda-se o uso de HTTPS (SSL/TLS), *hashing* de senhas (bcrypt) e proteção contra CSRF. |

# 11. MUDANÇAS REALIZADAS NA PRIMEIRA VERSÃO DO SOFTWARE (MVP) DURANTE O DESENVOLVIMENTO DO PROJETO DE ARQUITETURA

Durante o desenvolvimento do projeto de arquitetura da UBS Digital, algumas mudanças importantes foram aplicadas em relação ao MVP inicial, visando melhorar a organização, a performance e a escalabilidade futura do sistema. As principais alterações foram:

1.  **Formalização da Tecnologia:** Antes era um modelo de dados genérico (SQL). Agora, a arquitetura está travada em Python (Flask) com SQLAlchemy (ORM) e Jinja2. Isso muda a forma como pensamos nas classes (agora são Models de uma aplicação).
2.  **Papel da Recepcionista:** No PDF original, o foco era quase total no Paciente. No DAS, a Recepcionista ganhou protagonismo com casos de uso exclusivos (UC002, UC006, UC007, UC008), tornando-se a administradora do sistema.
3.  **Escopo de Segurança:** O DAS define explicitamente que senhas são texto simples no MVP (produto mínimo viável), mas agora são senhas com *hash* para maior segurança, e define a sessão via Flask.
4.  **Restrições de Negócio:** O DAS introduz regras claras sobre Performance (Login em 3s) e Volume (estimativa de 8.024 usuários).

### Transição de Aplicativo Nativo (Mobile) para Aplicação Web Responsiva

A principal alteração arquitetural realizada nesta versão foi a mudança do modelo de entrega de um Aplicativo Nativo (Android) para um **Sistema Web Responsivo (Aplicação Web)**. Esta decisão foi tomada com base nos seguintes critérios de arquitetura:

1.  **Alteração da Stack Tecnológica:** Optou-se pela utilização do micro-framework Flask (Python) com renderização de templates via Jinja2 e estilização com Bootstrap 5. Esta abordagem elimina a necessidade de desenvolver *frontends* separados (Mobile/Desktop), permitindo uma única base de código que se adapta a diferentes telas.
2.  **Maximização da Portabilidade:** Enquanto o escopo inicial limitava o acesso a dispositivos Android, a nova arquitetura Web garante que o sistema seja acessível por qualquer dispositivo (Smartphones iOS/Android, Tablets e Desktops) que possua um navegador web, atendendo ao requisito de qualidade de Portabilidade descrito na arquitetura.
3.  **Facilidade de Implantação e Manutenção (MVP):** A arquitetura centralizada no servidor (*Server-Side Rendering*) simplifica o ciclo de atualizações. Correções de *bugs* e novas *features* tornam-se disponíveis instantaneamente para todos os usuários (Pacientes e Recepcionistas), sem a necessidade de os usuários atualizarem um aplicativo em suas lojas de aplicativos, o que agiliza a validação do MVP.
