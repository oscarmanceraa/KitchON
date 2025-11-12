from flask import Blueprint, request, jsonify
from models import db, Estado
from flask_jwt_extended import jwt_required

estados_bp = Blueprint('estados', __name__)

@estados_bp.route('/', methods=['GET'])
@jwt_required()
def get_estados():
    try:
        estados = Estado.query.all()
        
        resultado = []
        for estado in estados:
            estado_data = {
                'IdEstado': estado.IdEstado,
                'Estado': estado.Estado
            }
            resultado.append(estado_data)
        
        return jsonify(resultado), 200
        
    except Exception as e:
        print(f'Error obteniendo estados: {e}')
        return jsonify({'error': 'Error interno del servidor'}), 500

