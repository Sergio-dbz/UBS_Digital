# =====================================================
# API RESTful - Sistema de Gestão de UBS
# Backend: Flask + MySQL + REST Best Practices
# =====================================================

from flask import Flask, request, session, jsonify, render_template, redirect, url_for
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta, date
from functools import wraps
import re

try:
    from config import Config
except ImportError:
    from config import Config

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)
db = SQLAlchemy(app)



# =====================================================
# FUNÇÕES UTILITÁRIAS E VALIDAÇÕES
# =====================================================

def validar_cpf(cpf):
    """Verifica se o CPF é matematicamente válido"""
    cpf = re.sub(r'\D', '', str(cpf))
    if len(cpf) != 11 or cpf == cpf[0] * 11:
        return False
    
    soma = sum(int(cpf[i]) * (10 - i) for i in range(9))
    resto = (soma * 10) % 11
    if (resto if resto < 10 else 0) != int(cpf[9]): return False

    soma = sum(int(cpf[i]) * (11 - i) for i in range(10))
    resto = (soma * 10) % 11
    if (resto if resto < 10 else 0) != int(cpf[10]): return False
    
    return True

def validar_telefone(telefone):
    if not telefone: return True # Vazio é permitido
    telefone_limpo = ''.join(c for c in str(telefone) if c.isdigit())
    return len(telefone_limpo) in (10, 11)

def erro_db_padrao(error):
    texto = str(error).lower()
    if 'cpf' in texto: return 'CPF já cadastrado.'
    if 'cns' in texto: return 'CNS já cadastrado.'
    if 'email' in texto: return 'E-mail já cadastrado.'
    return 'Erro de integridade no banco de dados.'

# =====================================================
# MIDDLEWARES (DECORATORS) PARA AUTENTICAÇÃO REST
# =====================================================

def requer_autenticacao(tipo_permitido=None):
    """Bloqueia rotas se o usuário não estiver logado ou não tiver a permissão correta."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'user_id' not in session:
                return jsonify({'erro': 'Autenticação necessária'}), 401 # Unauthorized
            
            if tipo_permitido and session.get('user_type') != tipo_permitido:
                return jsonify({'erro': 'Acesso negado (Permissão insuficiente)'}), 403 # Forbidden
                
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# =====================================================
# MODELOS (ORM) COM SERIALIZAÇÃO JSON
# =====================================================

class BaseModel(db.Model):
    __abstract__ = True
    def to_dict(self):
        """Converte automaticamente os objetos do banco em Dicionários/JSON"""
        d = {}
        for c in self.__table__.columns:
            val = getattr(self, c.name)
            if isinstance(val, (datetime, date)):
                d[c.name] = val.isoformat()
            else:
                d[c.name] = val
        return d

class Recepcionista(BaseModel):
    __tablename__ = 'recepcionistas'
    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(100), unique=True, nullable=False)
    senha = db.Column(db.String(255), nullable=False) # Agora será Hash
    nome = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Paciente(BaseModel):
    __tablename__ = 'pacientes'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(200), nullable=False)
    cpf = db.Column(db.String(14), unique=True, nullable=False)
    senha = db.Column(db.String(255), nullable=False) # Agora será Hash
    cns = db.Column(db.String(15), unique=True, nullable=False)
    telefone = db.Column(db.String(20))
    email = db.Column(db.String(100), unique=True, nullable=True)
    data_nascimento = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Para segurança, evitamos enviar a senha na resposta da API
    def to_dict(self):
        d = super().to_dict()
        d.pop('senha', None)
        return d

class Medico(BaseModel):
    __tablename__ = 'medicos'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(200), nullable=False)
    especialidade = db.Column(db.String(100), nullable=False)
    crm = db.Column(db.String(20))

class Consulta(BaseModel):
    __tablename__ = 'consultas'
    id = db.Column(db.Integer, primary_key=True)
    paciente_id = db.Column(db.Integer, db.ForeignKey('pacientes.id'), nullable=False)
    medico_id = db.Column(db.Integer, db.ForeignKey('medicos.id'), nullable=False)
    data_hora = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.Enum('Agendada', 'Realizada', 'Faltou'), default='Agendada')
    
    paciente = db.relationship('Paciente')
    medico = db.relationship('Medico')

    def to_dict(self):
        d = super().to_dict()
        # Adiciona dados aninhados para facilitar o Frontend
        d['paciente_nome'] = self.paciente.nome if self.paciente else None
        d['medico_nome'] = self.medico.nome if self.medico else None
        return d

class Historico(BaseModel):
    __tablename__ = 'historico'
    id = db.Column(db.Integer, primary_key=True)
    consulta_id = db.Column(db.Integer, db.ForeignKey('consultas.id'), nullable=False)
    status_anterior = db.Column(db.String(50))
    status_novo = db.Column(db.String(50), nullable=False)
    data_alteracao = db.Column(db.DateTime, default=datetime.utcnow)


# =====================================================
# ROTAS GERAIS (AUTENTICAÇÃO E METADADOS)
# =====================================================

@app.route('/api/login', methods=['POST'])
def api_login():
    """POST /api/login - Cria uma sessão (Login)"""
    dados = request.get_json() or {}
    usuario = dados.get('usuario')
    senha = dados.get('senha')
    tipo = dados.get('tipo')

    if not all([usuario, senha, tipo]):
        return jsonify({'erro': 'Usuário, senha e tipo são obrigatórios'}), 400 # Bad Request

    if tipo == 'paciente':
        cpf_limpo = re.sub(r'\D', '', usuario)
        user = Paciente.query.filter_by(cpf=cpf_limpo).first()
    elif tipo == 'recepcionista':
        user = Recepcionista.query.filter_by(login=usuario).first()
    else:
        return jsonify({'erro': 'Tipo de usuário inválido'}), 400

    # Validação do Hash da senha
    if user and check_password_hash(user.senha, senha):
        session['user_id'] = user.id
        session['user_type'] = tipo
        session['user_name'] = user.nome
        return jsonify({
            'mensagem': 'Login efetuado com sucesso',
            'usuario': user.to_dict(),
            'tipo': tipo
        }), 200 # OK
    
    return jsonify({'erro': 'Credenciais inválidas'}), 401

@app.route('/api/logout', methods=['POST'])
@requer_autenticacao()
def api_logout():
    """POST /api/logout - Destrói a sessão (Logout)"""
    session.clear()
    return jsonify({'mensagem': 'Sessão encerrada com sucesso'}), 200


@app.route('/api/medicos', methods=['GET'])
@requer_autenticacao()
def api_listar_medicos():
    """GET /api/medicos - Lista de médicos para agendamento"""
    medicos = Medico.query.all()
    return jsonify([m.to_dict() for m in medicos]), 200


# =====================================================
# ROTAS DO PACIENTE
# =====================================================

@app.route('/api/paciente/perfil', methods=['GET', 'PUT'])
@requer_autenticacao('paciente')
def api_perfil_paciente():
    """GET para ler dados do perfil. PUT para atualizar dados (Idempotente)."""
    paciente = Paciente.query.get(session['user_id'])
    
    if request.method == 'GET':
        return jsonify(paciente.to_dict()), 200
        
    if request.method == 'PUT':
        dados = request.get_json()
        
        email = dados.get('email', '').strip() or None
        telefone = dados.get('telefone')
        telefone_limpo = ''.join(c for c in str(telefone) if c.isdigit()) if telefone else None
        
        try:
            paciente.email = email
            paciente.telefone = telefone_limpo
            db.session.commit()
            return jsonify({'mensagem': 'Perfil atualizado com sucesso', 'paciente': paciente.to_dict()}), 200
        except IntegrityError as e:
            db.session.rollback()
            return jsonify({'erro': erro_db_padrao(e)}), 409 # Conflict


@app.route('/api/paciente/consultas', methods=['GET', 'POST'])
@requer_autenticacao('paciente')
def api_consultas_paciente():
    """GET: Lista consultas do paciente. POST: Cria nova consulta."""
    paciente_id = session['user_id']
    
    if request.method == 'GET':
        # Separa histórico e agendadas usando Query Params (ex: ?tipo=historico)
        tipo = request.args.get('tipo', 'agendadas')
        
        if tipo == 'agendadas':
            consultas = Consulta.query.filter(
                Consulta.paciente_id == paciente_id,
                Consulta.status == 'Agendada',
                Consulta.data_hora >= datetime.now()
            ).order_by(Consulta.data_hora).all()
        else:
            consultas = Consulta.query.filter(
                Consulta.paciente_id == paciente_id,
                Consulta.status != 'Agendada'
            ).order_by(Consulta.data_hora.desc()).all()
            
        return jsonify([c.to_dict() for c in consultas]), 200
        
    if request.method == 'POST':
        dados = request.get_json()
        medico_id = dados.get('medico_id')
        data_hora_str = dados.get('data_hora')
        
        if not medico_id or not data_hora_str:
            return jsonify({'erro': 'Médico e data/hora são obrigatórios'}), 400
            
        data_hora = datetime.strptime(data_hora_str, '%Y-%m-%dT%H:%M')
        
        if data_hora <= datetime.now():
            return jsonify({'erro': 'A data da consulta deve ser futura'}), 400
            
        # RN03: Checar ocupação do médico
        data_hora_norm = data_hora.replace(second=0, microsecond=0)
        ocupado = Consulta.query.filter_by(medico_id=medico_id, status='Agendada', data_hora=data_hora_norm).first()
        if ocupado:
            return jsonify({'erro': 'Horário indisponível para este médico'}), 409
            
        # RN04: Limite de 1 por dia
        inicio_dia = data_hora.replace(hour=0, minute=0, second=0)
        fim_dia = data_hora.replace(hour=23, minute=59, second=59)
        ja_marcado = Consulta.query.filter(
            Consulta.paciente_id == paciente_id, Consulta.status == 'Agendada',
            Consulta.data_hora >= inicio_dia, Consulta.data_hora <= fim_dia
        ).first()
        
        if ja_marcado:
            return jsonify({'erro': 'Apenas 1 consulta permitida por dia'}), 403
            
        nova_consulta = Consulta(paciente_id=paciente_id, medico_id=medico_id, data_hora=data_hora, status='Agendada')
        db.session.add(nova_consulta)
        db.session.commit()
        
        return jsonify({'mensagem': 'Agendamento confirmado', 'consulta': nova_consulta.to_dict()}), 201 # Created


@app.route('/api/paciente/consultas/<int:consulta_id>', methods=['DELETE'])
@requer_autenticacao('paciente')
def api_cancelar_consulta(consulta_id):
    """DELETE /api/paciente/consultas/<id> - Cancela uma consulta (RN de 24h)"""
    consulta = Consulta.query.filter_by(id=consulta_id, paciente_id=session['user_id']).first()
    
    if not consulta:
        return jsonify({'erro': 'Consulta não encontrada'}), 404 # Not Found
        
    if consulta.status != 'Agendada':
        return jsonify({'erro': 'Apenas consultas agendadas podem ser canceladas'}), 400
        
    if datetime.now() > (consulta.data_hora - timedelta(hours=24)):
        return jsonify({'erro': 'Cancelamento exige 24h de antecedência'}), 403 # Forbidden
        
    db.session.delete(consulta)
    db.session.commit()
    return jsonify({'mensagem': 'Consulta cancelada com sucesso'}), 200 # ou 204 No Content


# =====================================================
# ROTAS DO RECEPCIONISTA (CRUD COMPLETO REST)
# =====================================================

@app.route('/api/recepcionista/pacientes', methods=['GET', 'POST'])
@requer_autenticacao('recepcionista')
def api_crud_pacientes():
    """GET: Lista todos. POST: Cadastra novo."""
    if request.method == 'GET':
        pacientes = Paciente.query.all()
        return jsonify([p.to_dict() for p in pacientes]), 200
        
    if request.method == 'POST':
        dados = request.get_json()
        cpf = re.sub(r'\D', '', dados.get('cpf', ''))
        
        if not validar_cpf(cpf):
            return jsonify({'erro': 'CPF inválido'}), 400
            
        # Hash da senha (Segurança LGPD)
        senha_hash = generate_password_hash(dados.get('senha', '123456'))
        
        telefone_limpo = ''.join(c for c in str(dados.get('telefone', '')) if c.isdigit()) or None
        data_nasc = datetime.strptime(dados.get('data_nascimento'), '%Y-%m-%d').date() if dados.get('data_nascimento') else None

        novo_paciente = Paciente(
            nome=dados.get('nome'), cpf=cpf, senha=senha_hash,
            cns=dados.get('cns'), telefone=telefone_limpo, data_nascimento=data_nasc
        )
        
        try:
            db.session.add(novo_paciente)
            db.session.commit()
            return jsonify({'mensagem': 'Paciente cadastrado', 'paciente': novo_paciente.to_dict()}), 201
        except IntegrityError as e:
            db.session.rollback()
            return jsonify({'erro': erro_db_padrao(e)}), 409


@app.route('/api/recepcionista/pacientes/<int:paciente_id>', methods=['PUT', 'DELETE'])
@requer_autenticacao('recepcionista')
def api_paciente_id(paciente_id):
    """PUT: Atualiza paciente completo. DELETE: Remove do sistema."""
    paciente = Paciente.query.get(paciente_id)
    if not paciente:
        return jsonify({'erro': 'Paciente não encontrado'}), 404
        
    if request.method == 'PUT':
        dados = request.get_json()
        
        paciente.nome = dados.get('nome', paciente.nome)
        paciente.cns = dados.get('cns', paciente.cns)
        if 'cpf' in dados:
            paciente.cpf = re.sub(r'\D', '', dados['cpf'])
        if 'telefone' in dados:
            paciente.telefone = ''.join(c for c in str(dados['telefone']) if c.isdigit()) or None
        if 'data_nascimento' in dados and dados['data_nascimento']:
            paciente.data_nascimento = datetime.strptime(dados['data_nascimento'], '%Y-%m-%d').date()
            
        try:
            db.session.commit()
            return jsonify({'mensagem': 'Paciente atualizado', 'paciente': paciente.to_dict()}), 200
        except IntegrityError as e:
            db.session.rollback()
            return jsonify({'erro': erro_db_padrao(e)}), 409
            
    if request.method == 'DELETE':
        # Exclusão em cascata (Histórico -> Consultas -> Paciente)
        consultas = Consulta.query.filter_by(paciente_id=paciente.id).all()
        for consulta in consultas:
            Historico.query.filter_by(consulta_id=consulta.id).delete()
            db.session.delete(consulta)
            
        db.session.delete(paciente)
        db.session.commit()
        return jsonify({'mensagem': 'Paciente deletado com sucesso'}), 200


@app.route('/api/recepcionista/consultas', methods=['GET'])
@requer_autenticacao('recepcionista')
def api_listar_todas_consultas():
    """GET /api/recepcionista/consultas - Lista todas"""
    consultas = Consulta.query.order_by(Consulta.data_hora.desc()).all()
    return jsonify([c.to_dict() for c in consultas]), 200


@app.route('/api/recepcionista/consultas/<int:consulta_id>/status', methods=['PUT'])
def atualizar_status_consulta(consulta_id):
    # Proteção de segurança
    if 'user_id' not in session or session.get('user_type') != 'recepcionista':
        return jsonify({'erro': 'Acesso não autorizado'}), 403
        
    dados = request.get_json()
    novo_status = dados.get('status')
    
    if not novo_status:
        return jsonify({'erro': 'Status não informado'}), 400
        
    consulta = Consulta.query.get(consulta_id)
    if not consulta:
        return jsonify({'erro': 'Consulta não encontrada'}), 404
        
    # Atualiza o status no banco de dados
    consulta.status = novo_status
    db.session.commit()
    
    return jsonify({'mensagem': f'Status da consulta #{consulta_id} atualizado para {novo_status}'}), 200


# =====================================================
# API ABERTA (Já estava no padrão)
# =====================================================

@app.route('/api/consultas/horarios-ocupados', methods=['GET'])
def api_horarios_ocupados():
    """Retorna lista (JSON Array) de strings com horários (ex: ['08:30'])"""
    medico_id = request.args.get('medico_id')
    data_str = request.args.get('data')

    if not medico_id or not data_str:
        return jsonify([]), 400

    try:
        inicio_dia = datetime.strptime(data_str, '%Y-%m-%d')
        fim_dia = inicio_dia.replace(hour=23, minute=59, second=59)

        consultas = Consulta.query.filter(
            Consulta.medico_id == medico_id,
            Consulta.status == 'Agendada',
            Consulta.data_hora >= inicio_dia,
            Consulta.data_hora <= fim_dia
        ).all()

        horarios_ocupados = [c.data_hora.strftime('%H:%M') for c in consultas]
        return jsonify(horarios_ocupados), 200
    except Exception:
        return jsonify({'erro': 'Formato de data inválido'}), 400

# =====================================================
# ROTAS DO FRONTEND (Apenas entregam o HTML para o Navegador)
# =====================================================

@app.route('/')
@app.route('/login')
def pagina_login():
    return render_template('login1.html')

# =====================================================
# ROTAS DO FRONTEND do Paciente
# =====================================================

@app.route('/paciente/dashboard')
def pagina_dashboard_paciente():
    # Proteção para não deixar acessar sem login
    if 'user_id' not in session or session.get('user_type') != 'paciente':
        return redirect(url_for('pagina_login'))
        
    paciente_id = session['user_id']
    
    # Busca os dados para desenhar a tela inicial
    medicos = Medico.query.all()
    
    consultas = Consulta.query.filter(
        Consulta.paciente_id == paciente_id,
        Consulta.status == 'Agendada',
        Consulta.data_hora >= datetime.now()
    ).order_by(Consulta.data_hora).all()
    
    historico = Consulta.query.filter(
        Consulta.paciente_id == paciente_id,
        Consulta.status != 'Agendada'
    ).order_by(Consulta.data_hora.desc()).all()
    
    return render_template('dashboard_paciente1.html', 
                           medicos=medicos, 
                           consultas=consultas, 
                           historico=historico)

# =====================================================
# ROTAS DO FRONTEND do Recepcionista
# =====================================================

@app.route('/recepcionista/dashboard')
def pagina_dashboard_recepcionista():
    # Proteção de acesso
    if 'user_id' not in session or session.get('user_type') != 'recepcionista':
        return redirect(url_for('pagina_login'))
        
    # Busca todas as consultas e todos os pacientes para preencher as abas
    consultas = Consulta.query.order_by(Consulta.data_hora.desc()).all()
    pacientes = Paciente.query.order_by(Paciente.nome).all()
    
    return render_template('dashboard_recepcionista1.html', 
                           consultas=consultas, 
                           pacientes=pacientes)

# =====================================================
# ROTAS DO FRONTEND do Recepcionista para Editar Paciente
# =====================================================

@app.route('/recepcionista/paciente/editar/<int:paciente_id>', methods=['GET'])
def pagina_editar_paciente(paciente_id):
    if 'user_id' not in session or session.get('user_type') != 'recepcionista':
        return redirect(url_for('pagina_login'))
        
    paciente = Paciente.query.get_or_404(paciente_id)
    return render_template('editar_paciente1.html', paciente=paciente)

# =====================================================
# ROTAS DO FRONTEND do Perfil do Paciente
# =====================================================
@app.route('/paciente/perfil')
def pagina_perfil_paciente():
    # Proteção de acesso
    if 'user_id' not in session or session.get('user_type') != 'paciente':
        return redirect(url_for('pagina_login'))
        
    # Busca os dados do paciente logado para preencher a tela
    paciente = Paciente.query.get(session['user_id'])
    
    return render_template('perfil_paciente1.html', paciente=paciente)

# =====================================================
# APLICAÇÃO DO SISTEMA
# =====================================================

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)