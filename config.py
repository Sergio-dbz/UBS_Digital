# =====================================================
# Configurações do Sistema UBS
# =====================================================

import os

class Config:
    """
    Classe de configuração central do sistema.
    Armazena todas as configurações necessárias para o Flask e MySQL.
    """
    
    # Configuração de segurança do Flask
    # Em produção, use uma chave secreta forte e aleatória
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'chave-secreta-ubs-2024-dev'
    
    # =====================================================
    # CONFIGURAÇÃO DO BANCO DE DADOS MYSQL
    # =====================================================
    # Formato: mysql+pymysql://usuario:senha@host:porta/nome_banco
    
    # Configurações padrão (ajuste conforme seu ambiente)
    DB_HOST = os.environ.get('DB_HOST') or 'localhost'
    DB_PORT = os.environ.get('DB_PORT') or '3306'
    DB_USER = os.environ.get('DB_USER') or 'root'
    DB_PASSWORD = os.environ.get('DB_PASSWORD') or ''  # Coloque sua senha do MySQL aqui
    DB_NAME = os.environ.get('DB_NAME') or 'ubs_system'
    
    # String de conexão completa
    SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
    
    # Desabilitar rastreamento de modificações (economiza memória)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Configurações de sessão
    PERMANENT_SESSION_LIFETIME = 3600  # 1 hora em segundos
