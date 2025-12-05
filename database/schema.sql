-- =====================================================
-- Script SQL para Sistema de Gestão de UBS
-- Database: MySQL
-- =====================================================

-- Criar o banco de dados
CREATE DATABASE IF NOT EXISTS ubs_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ubs_system;

-- =====================================================
-- TABELA: Recepcionistas
-- Armazena os dados de login dos recepcionistas
-- =====================================================
CREATE TABLE IF NOT EXISTS recepcionistas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    nome VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TABELA: Pacientes
-- Armazena os dados dos pacientes da UBS
-- CNS (Cartão Nacional de Saúde/SUS) é obrigatório
-- =====================================================
CREATE TABLE IF NOT EXISTS pacientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    cns VARCHAR(15) NOT NULL UNIQUE COMMENT 'Número do Cartão SUS',
    telefone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    data_nascimento DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TABELA: Médicos
-- Armazena os dados dos médicos disponíveis na UBS
-- =====================================================
CREATE TABLE IF NOT EXISTS medicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    especialidade VARCHAR(100) NOT NULL,
    crm VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TABELA: Consultas
-- Armazena os agendamentos de consultas
-- Status possíveis: 'Agendada', 'Realizada', 'Faltou'
-- =====================================================
CREATE TABLE IF NOT EXISTS consultas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL,
    medico_id INT NOT NULL,
    data_hora DATETIME NOT NULL,
    status ENUM('Agendada', 'Realizada', 'Faltou') DEFAULT 'Agendada',
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Chaves estrangeiras
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
    FOREIGN KEY (medico_id) REFERENCES medicos(id) ON DELETE CASCADE,
    
    -- Índices para melhorar performance
    INDEX idx_paciente (paciente_id),
    INDEX idx_medico (medico_id),
    INDEX idx_data_hora (data_hora),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- INSERÇÃO DE DADOS FICTÍCIOS PARA TESTE
-- =====================================================

-- Inserir 2 recepcionistas
INSERT INTO recepcionistas (login, senha, nome) VALUES
('recep01', 'senha123', 'Maria Silva'),
('recep02', 'senha456', 'João Santos');

-- Inserir 2 pacientes
-- Nota: Em produção, as senhas devem ser hash (bcrypt, etc.)
INSERT INTO pacientes (nome, cpf, senha, cns, telefone, email, data_nascimento) VALUES
('Carlos Oliveira', '123.456.789-00', 'paciente123', '123456789012345', '(11) 98765-4321', 'carlos.o@email.com', '1985-03-15'),
('Ana Paula Costa', '987.654.321-00', 'paciente456', '987654321098765', '(11) 91234-5678', 'anapaula.c@email.com', '1990-07-22');

-- Inserir médicos
INSERT INTO medicos (nome, especialidade, crm) VALUES
('Dr. Roberto Almeida', 'Clínico Geral', 'CRM-SP 123456'),
('Dra. Fernanda Lima', 'Pediatria', 'CRM-SP 234567'),
('Dr. Paulo Mendes', 'Cardiologia', 'CRM-SP 345678'),
('Dra. Juliana Rocha', 'Ginecologia', 'CRM-SP 456789');

-- Inserir consultas de teste (algumas no passado, outras no futuro)
INSERT INTO consultas (paciente_id, medico_id, data_hora, status, observacoes) VALUES
-- Consultas passadas (para histórico)
(1, 1, '2024-11-15 09:00:00', 'Realizada', 'Consulta de rotina realizada com sucesso'),
(1, 3, '2024-11-20 14:30:00', 'Faltou', 'Paciente não compareceu'),
(2, 2, '2024-11-18 10:00:00', 'Realizada', 'Consulta pediátrica'),

-- Consultas futuras (agendadas)
(1, 2, '2025-12-05 11:00:00', 'Agendada', 'Consulta agendada pelo paciente'),
(2, 1, '2025-12-10 15:00:00', 'Agendada', 'Retorno clínico geral');

-- =====================================================
-- CONSULTAS ÚTEIS PARA VERIFICAÇÃO
-- =====================================================

-- Verificar todos os pacientes
-- SELECT * FROM pacientes;

-- Verificar todas as consultas com detalhes
-- SELECT c.id, p.nome AS paciente, m.nome AS medico, m.especialidade, 
--        c.data_hora, c.status, c.observacoes
-- FROM consultas c
-- JOIN pacientes p ON c.paciente_id = p.id
-- JOIN medicos m ON c.medico_id = m.id
-- ORDER BY c.data_hora DESC;

-- Verificar histórico de um paciente específico (consultas passadas)
-- SELECT c.id, m.nome AS medico, m.especialidade, c.data_hora, c.status
-- FROM consultas c
-- JOIN medicos m ON c.medico_id = m.id
-- WHERE c.paciente_id = 1 
--   AND c.data_hora < NOW()
--   AND c.status IN ('Realizada', 'Faltou')
-- ORDER BY c.data_hora DESC;
