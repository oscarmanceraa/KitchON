from flask import Blueprint, request, jsonify
from models import db, Mesa
from flask_jwt_extended import jwt_required

mesas_bp = Blueprint('mesas', __name__)

@mesas_bp.route('/', methods=['GET'])
@jwt_required()
def get_mesas():
    try:
        mesas = Mesa.query.all()
        
        resultado = []
        for mesa in mesas:
            mesa_data = {
                'IdMesa': mesa.IdMesa,
                'Mesa': mesa.Mesa
            }
            resultado.append(mesa_data)
        
        return jsonify(resultado), 200
        
    except Exception as e:
        print(f'Error obteniendo mesas: {e}')
        return jsonify({'error': 'Error interno del servidor'}), 500

