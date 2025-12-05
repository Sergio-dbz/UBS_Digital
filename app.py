# =====================================================
# Sistema de Gestão de UBS - Aplicação Principal
# Backend: Flask + MySQL
# =====================================================

from flask import Flask, render_template, request, redirect, url_for, session, flash
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from config import Config

# =====================================================
# INICIALIZAÇÃO DO FLASK E BANCO DE DADOS
# =====================================================

app = Flask(__name__)
app.config.from_object(Config)

# Inicializar SQLAlchemy para conexão com MySQL
# A conexão é estabelecida automaticamente usando a URI do config.py
db = SQLAlchemy(app)

# =====================================================
# MODELOS DO BANCO DE DADOS (ORM)
# Mapeiam as tabelas MySQL para classes Python
# =====================================================

class Recepcionista(db.Model):
    """Modelo para a tabela 'recepcionistas'"""
    __tablename__ = 'recepcionistas'
    
    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(100), unique=True, nullable=False)
    senha = db.Column(db.String(255), nullable=False)
    nome = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Paciente(db.Model):
    """Modelo para a tabela 'pacientes'"""
    __tablename__ = 'pacientes'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(200), nullable=False)
    cpf = db.Column(db.String(14), unique=True, nullable=False)
    senha = db.Column(db.String(255), nullable=False)
    cns = db.Column(db.String(15), unique=True, nullable=False)  # Cartão SUS
    telefone = db.Column(db.String(20))
    email = db.Column(db.String(100), unique=True, nullable=True) # Novo campo
    data_nascimento = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamento com consultas
    consultas = db.relationship('Consulta', backref='paciente', lazy=True)


class Medico(db.Model):
    """Modelo para a tabela 'medicos'"""
    __tablename__ = 'medicos'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(200), nullable=False)
    especialidade = db.Column(db.String(100), nullable=False)
    crm = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamento com consultas
    consultas = db.relationship('Consulta', backref='medico', lazy=True)


class Consulta(db.Model):
    """Modelo para a tabela 'consultas'"""
    __tablename__ = 'consultas'
    
    id = db.Column(db.Integer, primary_key=True)
    paciente_id = db.Column(db.Integer, db.ForeignKey('pacientes.id'), nullable=False)
    medico_id = db.Column(db.Integer, db.ForeignKey('medicos.id'), nullable=False)
    data_hora = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.Enum('Agendada', 'Realizada', 'Faltou'), default='Agendada')
    observacoes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# =====================================================
# ROTAS GERAIS
# =====================================================

@app.route('/')
def index():
    """Página inicial - Redireciona para login"""
    return redirect(url_for('login'))


@app.route('/login', methods=['GET', 'POST'])
def login():
    """
    Rota de login unificada.
    Identifica se é paciente ou recepcionista pelo tipo de credencial.
    """
    if request.method == 'POST':
        usuario = request.form.get('usuario')
        senha = request.form.get('senha')
        tipo = request.form.get('tipo')  # 'paciente' ou 'recepcionista'
        
        if tipo == 'paciente':
            # Login do paciente usando CPF
            paciente = Paciente.query.filter_by(cpf=usuario, senha=senha).first()
            
            if paciente:
                session['user_id'] = paciente.id
                session['user_type'] = 'paciente'
                session['user_name'] = paciente.nome
                flash(f'Bem-vindo(a), {paciente.nome}!', 'success')
                return redirect(url_for('dashboard_paciente'))
            else:
                flash('CPF ou senha inválidos!', 'error')
        
        elif tipo == 'recepcionista':
            # Login do recepcionista usando login
            recepcionista = Recepcionista.query.filter_by(login=usuario, senha=senha).first()
            
            if recepcionista:
                session['user_id'] = recepcionista.id
                session['user_type'] = 'recepcionista'
                session['user_name'] = recepcionista.nome
                flash(f'Bem-vindo(a), {recepcionista.nome}!', 'success')
                return redirect(url_for('dashboard_recepcionista'))
            else:
                flash('Login ou senha inválidos!', 'error')
    
    return render_template('login.html')


@app.route('/logout')
def logout():
    """Rota de logout - Limpa a sessão"""
    session.clear()
    flash('Você saiu do sistema.', 'info')
    return redirect(url_for('login'))


# =====================================================
# ROTAS DO PACIENTE

@app.route('/paciente/perfil')
def perfil_paciente():
    """Exibe as informações de cadastro do paciente logado."""
    if 'user_type' not in session or session['user_type'] != 'paciente':
        flash('Acesso negado! Faça login como paciente.', 'error')
        return redirect(url_for('login'))
    
    paciente_id = session['user_id']
    paciente = Paciente.query.get_or_404(paciente_id)
    
    return render_template('perfil_paciente.html', paciente=paciente)


@app.route('/paciente/perfil/atualizar', methods=['POST'])
def atualizar_perfil_paciente():
    """
    Rota para paciente atualizar informações básicas (telefone e e-mail).
    """
    if 'user_type' not in session or session['user_type'] != 'paciente':
        flash('Acesso negado!', 'error')
        return redirect(url_for('login'))
    
    paciente_id = session['user_id']
    paciente = Paciente.query.get_or_404(paciente_id)
    
    novo_telefone = request.form.get('telefone')
    novo_email = request.form.get('email')
    
    try:
        # 1. Atualizar Telefone
        paciente.telefone = novo_telefone
        
        # 2. Atualizar E-mail (com validação de unicidade)
        if novo_email:
            # Verificar se o novo e-mail já existe para outro paciente
            email_existente = Paciente.query.filter(
                Paciente.email == novo_email, 
                Paciente.id != paciente_id
            ).first()
            
            if email_existente:
                flash('Este e-mail já está cadastrado para outro usuário.', 'error')
                return redirect(url_for('perfil_paciente'))
        
        paciente.email = novo_email
        
        db.session.commit()
        flash('Seu perfil foi atualizado com sucesso!', 'success')
    except Exception as e:
        db.session.rollback()
        flash(f'Erro ao atualizar perfil: {str(e)}', 'error')
        
    return redirect(url_for('perfil_paciente'))


@app.route('/paciente/cancelar_consulta/<int:consulta_id>')
def cancelar_consulta(consulta_id):
    """
    Permite ao paciente cancelar uma consulta com validação de 24 horas.
    """
    if 'user_type' not in session or session['user_type'] != 'paciente':
        flash('Acesso negado!', 'error')
        return redirect(url_for('login'))
    
    paciente_id = session['user_id']
    consulta = Consulta.query.filter_by(id=consulta_id, paciente_id=paciente_id).first()
    
    if not consulta:
        flash('Consulta não encontrada ou você não tem permissão para cancelá-la.', 'error')
        return redirect(url_for('dashboard_paciente'))
        
    if consulta.status != 'Agendada':
        flash(f'Não é possível cancelar uma consulta com status "{consulta.status}".', 'error')
        return redirect(url_for('dashboard_paciente'))
        
    # Regra de Negócio: Cancelamento deve ser feito com pelo menos 24 horas de antecedência
    limite_cancelamento = consulta.data_hora - timedelta(hours=24)
    
    if datetime.now() > limite_cancelamento:
        flash('O cancelamento deve ser feito com no mínimo 24 horas de antecedência.', 'error')
        return redirect(url_for('dashboard_paciente'))
        
    try:
        # Ação: Deletar a consulta
        db.session.delete(consulta)
        db.session.commit()
        flash('Consulta cancelada com sucesso!', 'success')
    except Exception as e:
        db.session.rollback()
        flash(f'Erro ao cancelar consulta: {str(e)}', 'error')
        
    return redirect(url_for('dashboard_paciente'))


# ROTAS DO PACIENTE
# =====================================================

@app.route('/paciente/dashboard')
def dashboard_paciente():
    """Dashboard principal do paciente"""
    if 'user_type' not in session or session['user_type'] != 'paciente':
        flash('Acesso negado! Faça login como paciente.', 'error')
        return redirect(url_for('login'))
    
    # Buscar todos os médicos disponíveis
    medicos = Medico.query.all()
    
    # Buscar consultas agendadas (futuras) do paciente
    paciente_id = session['user_id']
    consultas_agendadas = Consulta.query.filter_by(
        paciente_id=paciente_id,
        status='Agendada'
    ).filter(Consulta.data_hora >= datetime.now()).order_by(Consulta.data_hora).all()
    
    return render_template('dashboard_paciente.html', 
                         medicos=medicos, 
                         consultas=consultas_agendadas)


@app.route('/paciente/agendar', methods=['POST'])
def agendar_consulta():
    """Rota para paciente agendar uma consulta"""
    if 'user_type' not in session or session['user_type'] != 'paciente':
        flash('Acesso negado!', 'error')
        return redirect(url_for('login'))
    
    medico_id = request.form.get('medico_id')
    data_hora_str = request.form.get('data_hora')
    
    try:
        # Converter string para datetime
        data_hora = datetime.strptime(data_hora_str, '%Y-%m-%dT%H:%M')
        
        # 1. Lógica de Intervalos de 30 minutos
        if data_hora.minute not in [0, 30]:
            flash('O agendamento deve ser feito em intervalos de 30 minutos (ex: 08:00, 08:30).', 'error')
            return redirect(url_for('dashboard_paciente'))
            
        # Verificar se a data é futura
        if data_hora <= datetime.now():
            flash('A data da consulta deve ser futura!', 'error')
            return redirect(url_for('dashboard_paciente'))
        
        # 2. ERRO CRÍTICO (RN03): Choque de Horários - Verificar se o médico já está ocupado
        conflito_medico = Consulta.query.filter_by(
            medico_id=medico_id,
            data_hora=data_hora,
            status='Agendada' # Apenas consultas agendadas contam como ocupação
        ).first()

        if conflito_medico:
            # Busca o nome do médico para a mensagem de erro
            medico = Medico.query.get(medico_id)
            flash(f'O Dr(a). {medico.nome} já possui uma consulta agendada para {data_hora.strftime("%d/%m/%Y às %H:%M")}. Escolha outro horário.', 'error')
            return redirect(url_for('dashboard_paciente'))
            
        # Criar nova consulta
        nova_consulta = Consulta(
            paciente_id=session['user_id'],
            medico_id=medico_id,
            data_hora=data_hora,
            status='Agendada'
        )
        
        db.session.add(nova_consulta)
        db.session.commit()
        
        flash('Consulta agendada com sucesso!', 'success')
    except Exception as e:
        db.session.rollback()
        flash(f'Erro ao agendar consulta: {str(e)}', 'error')
    
    return redirect(url_for('dashboard_paciente'))


@app.route('/paciente/historico')
def historico_paciente():
    """
    Exibe o histórico de consultas passadas do paciente.
    Mostra apenas consultas com status 'Realizada' ou 'Faltou'.
    """
    if 'user_type' not in session or session['user_type'] != 'paciente':
        flash('Acesso negado!', 'error')
        return redirect(url_for('login'))
    
    paciente_id = session['user_id']
    
    # Buscar consultas passadas com status definido pelo recepcionista
    historico = Consulta.query.filter(
        Consulta.paciente_id == paciente_id,
        Consulta.data_hora < datetime.now(),
        Consulta.status.in_(['Realizada', 'Faltou'])
    ).order_by(Consulta.data_hora.desc()).all()
    
    return render_template('historico_paciente.html', historico=historico)


# =====================================================
# ROTAS DO RECEPCIONISTA
# =====================================================

@app.route('/recepcionista/dashboard')
def dashboard_recepcionista():
    """Dashboard principal do recepcionista"""
    if 'user_type' not in session or session['user_type'] != 'recepcionista':
        flash('Acesso negado! Faça login como recepcionista.', 'error')
        return redirect(url_for('login'))
    
    # Buscar todas as consultas (ordenadas por data)
    consultas = Consulta.query.order_by(Consulta.data_hora.desc()).all()
    
    # Buscar todos os pacientes
    pacientes = Paciente.query.all()
    
    return render_template('dashboard_recepcionista.html', 
                         consultas=consultas,
                         pacientes=pacientes)


@app.route('/recepcionista/cadastrar_paciente', methods=['POST'])
def cadastrar_paciente():
    """
    Rota para recepcionista cadastrar novo paciente.
    APENAS o recepcionista pode cadastrar pacientes.
    """
    if 'user_type' not in session or session['user_type'] != 'recepcionista':
        flash('Acesso negado!', 'error')
        return redirect(url_for('login'))
    
    nome = request.form.get('nome')
    cpf = request.form.get('cpf')
    senha = request.form.get('senha')
    cns = request.form.get('cns')  # Cartão SUS (obrigatório)
    telefone = request.form.get('telefone')
    data_nascimento_str = request.form.get('data_nascimento')
    
    try:
        # Converter data de nascimento
        data_nascimento = None
        if data_nascimento_str:
            data_nascimento = datetime.strptime(data_nascimento_str, '%Y-%m-%d').date()
        
        # Criar novo paciente
        novo_paciente = Paciente(
            nome=nome,
            cpf=cpf,
            senha=senha,
            cns=cns,
            telefone=telefone,
            data_nascimento=data_nascimento
        )
        
        db.session.add(novo_paciente)
        db.session.commit()
        
        flash(f'Paciente {nome} cadastrado com sucesso!', 'success')
    except Exception as e:
        db.session.rollback()
        flash(f'Erro ao cadastrar paciente: {str(e)}', 'error')
    
    return redirect(url_for('dashboard_recepcionista'))

# No arquivo app.py

@app.route('/editar_paciente/<int:paciente_id>', methods=['GET', 'POST'])
def editar_paciente(paciente_id):
    paciente = Paciente.query.get_or_404(paciente_id)
    
    if request.method == 'POST':
        try:
            # Atualiza apenas os campos permitidos
            paciente.nome = request.form['nome']
            paciente.cpf = request.form['cpf']
            
            # Tratamento da data
            paciente.data_nascimento = request.form['data_nascimento']
            
            paciente.cns = request.form['cns']
            paciente.telefone = request.form['telefone']

            db.session.commit()
            flash('Paciente atualizado com sucesso!', 'success')
            return redirect(url_for('dashboard_recepcionista'))
            
        except Exception as e:
            db.session.rollback()
            flash(f'Erro ao atualizar: {str(e)}', 'error')
            return redirect(url_for('editar_paciente', paciente_id=paciente.id))

    return render_template('editar_paciente.html', paciente=paciente)

@app.route('/recepcionista/atualizar_status/<int:consulta_id>/<novo_status>')
def atualizar_status_consulta(consulta_id, novo_status):
    """
    Rota para recepcionista atualizar o status da consulta.
    Status possíveis: 'Realizada' ou 'Faltou'
    """
    if 'user_type' not in session or session['user_type'] != 'recepcionista':
        flash('Acesso negado!', 'error')
        return redirect(url_for('login'))
    
    try:
        consulta = Consulta.query.get_or_404(consulta_id)
        
        # Validar status
        if novo_status not in ['Realizada', 'Faltou']:
            flash('Status inválido!', 'error')
            return redirect(url_for('dashboard_recepcionista'))
        
        consulta.status = novo_status
        db.session.commit()
        
        flash(f'Status atualizado para "{novo_status}"!', 'success')
    except Exception as e:
        db.session.rollback()
        flash(f'Erro ao atualizar status: {str(e)}', 'error')
    
    return redirect(url_for('dashboard_recepcionista'))


# =====================================================
# EXECUÇÃO DA APLICAÇÃO
# =====================================================

if __name__ == '__main__':
    # Criar todas as tabelas (caso não existam)
    # Nota: Em produção, use migrations (Flask-Migrate)
    with app.app_context():
        db.create_all()
    
    # Executar aplicação em modo debug
    app.run(debug=True, host='0.0.0.0', port=5000)
