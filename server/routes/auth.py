from flask import Blueprint, request, jsonify
from models import db, Usuario
import bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username y password son requeridos'}), 400
        
        usuario = Usuario.query.filter_by(Username=username).first()
        
        if not usuario:
            return jsonify({'error': 'Credenciales inválidas'}), 401
        
        if usuario.estado_usuario.Estado != 'Activo':
            return jsonify({'error': 'Usuario inactivo'}), 401
        
        # Verificar password
        if not bcrypt.checkpw(password.encode('utf-8'), usuario.Password.encode('utf-8')):
            return jsonify({'error': 'Credenciales inválidas'}), 401
        
        # Crear token JWT
        access_token = create_access_token(
            identity=usuario.IdUsuario,
            additional_claims={
                'username': usuario.Username,
                'IdTipoUsuario': usuario.IdTipoUsuario
            }
        )
        
        # Obtener datos completos del usuario
        usuario_data = {
            'IdUsuario': usuario.IdUsuario,
            'IdPersona': usuario.IdPersona,
            'IdTipoUsuario': usuario.IdTipoUsuario,
            'Username': usuario.Username,
            'IdEstado': usuario.IdEstado,
            'Persona': {
                'idPersona': usuario.persona.idPersona,
                'PrimerNombre': usuario.persona.PrimerNombre,
                'SegundoNombre': usuario.persona.SegundoNombre,
                'PrimerApellido': usuario.persona.PrimerApellido,
                'SegundoApellido': usuario.persona.SegundoApellido,
            },
            'TipoUsuario': {
                'IdTipoUsuario': usuario.tipo_usuario.IdTipoUsuario,
                'TipoUsuario': usuario.tipo_usuario.TipoUsuario,
            },
            'Estado': {
                'IdEstado': usuario.estado_usuario.IdEstado,
                'Estado': usuario.estado_usuario.Estado,
            }
        }
        
        return jsonify({
            'usuario': usuario_data,
            'token': access_token
        }), 200
        
    except Exception as e:
        print(f'Error en login: {e}')
        return jsonify({'error': 'Error interno del servidor'}), 500

@auth_bp.route('/verify', methods=['GET'])
@jwt_required()
def verify():
    try:
        current_user_id = get_jwt_identity()
        usuario = Usuario.query.get(current_user_id)
        
        if not usuario or usuario.estado_usuario.Estado != 'Activo':
            return jsonify({'error': 'Usuario no válido'}), 401
        
        usuario_data = {
            'IdUsuario': usuario.IdUsuario,
            'IdPersona': usuario.IdPersona,
            'IdTipoUsuario': usuario.IdTipoUsuario,
            'Username': usuario.Username,
            'IdEstado': usuario.IdEstado,
            'Persona': {
                'idPersona': usuario.persona.idPersona,
                'PrimerNombre': usuario.persona.PrimerNombre,
                'SegundoNombre': usuario.persona.SegundoNombre,
                'PrimerApellido': usuario.persona.PrimerApellido,
                'SegundoApellido': usuario.persona.SegundoApellido,
            },
            'TipoUsuario': {
                'IdTipoUsuario': usuario.tipo_usuario.IdTipoUsuario,
                'TipoUsuario': usuario.tipo_usuario.TipoUsuario,
            },
            'Estado': {
                'IdEstado': usuario.estado_usuario.IdEstado,
                'Estado': usuario.estado_usuario.Estado,
            }
        }
        
        return jsonify({'usuario': usuario_data}), 200
        
    except Exception as e:
        return jsonify({'error': 'Token inválido'}), 401

