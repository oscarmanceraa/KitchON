from flask import Blueprint, request, jsonify
from models import db, Producto
from flask_jwt_extended import jwt_required

productos_bp = Blueprint('productos', __name__)

@productos_bp.route('/', methods=['GET'])
@jwt_required()
def get_productos():
    try:
        productos = Producto.query.all()
        
        resultado = []
        for producto in productos:
            producto_data = {
                'IdProducto': producto.IdProducto,
                'IdTipoProducto': producto.IdTipoProducto,
                'NombreProducto': producto.NombreProducto,
                'Valor': producto.Valor,
                'IdEstado': producto.IdEstado,
                'TipoProducto': {
                    'IdTipoProducto': producto.tipo_producto.IdTipoProducto,
                    'TipoProducto': producto.tipo_producto.TipoProducto,
                },
                'Estado': {
                    'IdEstado': producto.estado_producto.IdEstado,
                    'Estado': producto.estado_producto.Estado,
                }
            }
            resultado.append(producto_data)
        
        return jsonify(resultado), 200
        
    except Exception as e:
        print(f'Error obteniendo productos: {e}')
        return jsonify({'error': 'Error interno del servidor'}), 500

@productos_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_producto(id):
    try:
        producto = Producto.query.get(id)
        
        if not producto:
            return jsonify({'error': 'Producto no encontrado'}), 404
        
        producto_data = {
            'IdProducto': producto.IdProducto,
            'IdTipoProducto': producto.IdTipoProducto,
            'NombreProducto': producto.NombreProducto,
            'Valor': producto.Valor,
            'IdEstado': producto.IdEstado,
            'TipoProducto': {
                'IdTipoProducto': producto.tipo_producto.IdTipoProducto,
                'TipoProducto': producto.tipo_producto.TipoProducto,
            },
            'Estado': {
                'IdEstado': producto.estado_producto.IdEstado,
                'Estado': producto.estado_producto.Estado,
            }
        }
        
        return jsonify(producto_data), 200
        
    except Exception as e:
        print(f'Error obteniendo producto: {e}')
        return jsonify({'error': 'Error interno del servidor'}), 500

@productos_bp.route('/', methods=['POST'])
@jwt_required()
def create_producto():
    try:
        data = request.get_json()
        IdTipoProducto = data.get('IdTipoProducto')
        NombreProducto = data.get('NombreProducto')
        Valor = data.get('Valor')
        IdEstado = data.get('IdEstado')
        
        if not all([IdTipoProducto, NombreProducto, Valor, IdEstado]):
            return jsonify({'error': 'Datos incompletos'}), 400
        
        nuevo_producto = Producto(
            IdTipoProducto=IdTipoProducto,
            NombreProducto=NombreProducto,
            Valor=Valor,
            IdEstado=IdEstado
        )
        
        db.session.add(nuevo_producto)
        db.session.commit()
        
        return jsonify({
            'IdProducto': nuevo_producto.IdProducto,
            'NombreProducto': nuevo_producto.NombreProducto
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f'Error creando producto: {e}')
        return jsonify({'error': 'Error interno del servidor'}), 500

@productos_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_producto(id):
    try:
        producto = Producto.query.get(id)
        if not producto:
            return jsonify({'error': 'Producto no encontrado'}), 404
        
        data = request.get_json()
        if 'IdTipoProducto' in data:
            producto.IdTipoProducto = data['IdTipoProducto']
        if 'NombreProducto' in data:
            producto.NombreProducto = data['NombreProducto']
        if 'Valor' in data:
            producto.Valor = data['Valor']
        if 'IdEstado' in data:
            producto.IdEstado = data['IdEstado']
        
        db.session.commit()
        
        return jsonify({
            'IdProducto': producto.IdProducto,
            'NombreProducto': producto.NombreProducto
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f'Error actualizando producto: {e}')
        return jsonify({'error': 'Error interno del servidor'}), 500

@productos_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_producto(id):
    try:
        producto = Producto.query.get(id)
        if not producto:
            return jsonify({'error': 'Producto no encontrado'}), 404
        
        db.session.delete(producto)
        db.session.commit()
        
        return jsonify({'message': 'Producto eliminado exitosamente'}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f'Error eliminando producto: {e}')
        return jsonify({'error': 'Error interno del servidor'}), 500

