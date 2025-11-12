from flask import Blueprint, request, jsonify
from models import db, Usuario
from flask_jwt_extended import jwt_required

usuarios_bp = Blueprint('usuarios', __name__)

@usuarios_bp.route('/', methods=['GET'])
@jwt_required()
def get_usuarios():
    try:
        usuarios = Usuario.query.all()
        
        resultado = []
        for usuario in usuarios:
            usuario_data = {
                'IdUsuario': usuario.IdUsuario,
                'IdPersona': usuario.IdPersona,
                'IdTipoUsuario': usuario.IdTipoUsuario,
                'Username': usuario.Username,
                'IdEstado': usuario.IdEstado,
                'Persona': {
                    'idPersona': usuario.persona.idPersona,
                    'PrimerNombre': usuario.persona.PrimerNombre,
                    'PrimerApellido': usuario.persona.PrimerApellido,
                },
                'TipoUsuario': {
                    'IdTipoUsuario': usuario.tipo_usuario.IdTipoUsuario,
                    'TipoUsuario': usuario.tipo_usuario.TipoUsuario,
                }
            }
            resultado.append(usuario_data)
        
        return jsonify(resultado), 200
        
    except Exception as e:
        print(f'Error obteniendo usuarios: {e}')
        return jsonify({'error': 'Error interno del servidor'}), 500

