from flask import Blueprint, request, jsonify
from models import db, Orden, ProductoOrden
from flask_jwt_extended import jwt_required
from datetime import datetime

ordenes_bp = Blueprint('ordenes', __name__)

@ordenes_bp.route('/', methods=['GET'])
@jwt_required()
def get_ordenes():
    try:
        ordenes = Orden.query.order_by(Orden.FechaCreacion.desc()).all()
        
        resultado = []
        for orden in ordenes:
            orden_data = {
                'IdOrden': orden.IdOrden,
                'IdUsuario': orden.IdUsuario,
                'IdMesa': orden.IdMesa,
                'IdEstado': orden.IdEstado,
                'FechaCreacion': orden.FechaCreacion.isoformat() if orden.FechaCreacion else None,
                'Usuario': {
                    'IdUsuario': orden.usuario.IdUsuario,
                    'Username': orden.usuario.Username,
                    'Persona': {
                        'idPersona': orden.usuario.persona.idPersona,
                        'PrimerNombre': orden.usuario.persona.PrimerNombre,
                        'PrimerApellido': orden.usuario.persona.PrimerApellido,
                    },
                    'TipoUsuario': {
                        'IdTipoUsuario': orden.usuario.tipo_usuario.IdTipoUsuario,
                        'TipoUsuario': orden.usuario.tipo_usuario.TipoUsuario,
                    }
                },
                'Mesa': {
                    'IdMesa': orden.mesa.IdMesa,
                    'Mesa': orden.mesa.Mesa,
                },
                'Estado': {
                    'IdEstado': orden.estado_orden.IdEstado,
                    'Estado': orden.estado_orden.Estado,
                },
                'ProductosOrden': []
            }
            
            for producto_orden in orden.productos_orden:
                producto_data = {
                    'IdProducto': producto_orden.IdProducto,
                    'IdOrden': producto_orden.IdOrden,
                    'Cantidad': producto_orden.Cantidad,
                    'Notas': producto_orden.Notas,
                    'Producto': {
                        'IdProducto': producto_orden.producto.IdProducto,
                        'NombreProducto': producto_orden.producto.NombreProducto,
                        'Valor': producto_orden.producto.Valor,
                        'TipoProducto': {
                            'IdTipoProducto': producto_orden.producto.tipo_producto.IdTipoProducto,
                            'TipoProducto': producto_orden.producto.tipo_producto.TipoProducto,
                        }
                    }
                }
                orden_data['ProductosOrden'].append(producto_data)
            
            resultado.append(orden_data)
        
        return jsonify(resultado), 200
        
    except Exception as e:
        print(f'Error obteniendo órdenes: {e}')
        return jsonify({'error': 'Error interno del servidor'}), 500

@ordenes_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_orden(id):
    try:
        orden = Orden.query.get(id)
        
        if not orden:
            return jsonify({'error': 'Orden no encontrada'}), 404
        
        orden_data = {
            'IdOrden': orden.IdOrden,
            'IdUsuario': orden.IdUsuario,
            'IdMesa': orden.IdMesa,
            'IdEstado': orden.IdEstado,
            'FechaCreacion': orden.FechaCreacion.isoformat() if orden.FechaCreacion else None,
            'Usuario': {
                'IdUsuario': orden.usuario.IdUsuario,
                'Username': orden.usuario.Username,
                'Persona': {
                    'idPersona': orden.usuario.persona.idPersona,
                    'PrimerNombre': orden.usuario.persona.PrimerNombre,
                    'PrimerApellido': orden.usuario.persona.PrimerApellido,
                },
                'TipoUsuario': {
                    'IdTipoUsuario': orden.usuario.tipo_usuario.IdTipoUsuario,
                    'TipoUsuario': orden.usuario.tipo_usuario.TipoUsuario,
                }
            },
            'Mesa': {
                'IdMesa': orden.mesa.IdMesa,
                'Mesa': orden.mesa.Mesa,
            },
            'Estado': {
                'IdEstado': orden.estado_orden.IdEstado,
                'Estado': orden.estado_orden.Estado,
            },
            'ProductosOrden': []
        }
        
        for producto_orden in orden.productos_orden:
            producto_data = {
                'IdProducto': producto_orden.IdProducto,
                'IdOrden': producto_orden.IdOrden,
                'Cantidad': producto_orden.Cantidad,
                'Notas': producto_orden.Notas,
                'Producto': {
                    'IdProducto': producto_orden.producto.IdProducto,
                    'NombreProducto': producto_orden.producto.NombreProducto,
                    'Valor': producto_orden.producto.Valor,
                    'TipoProducto': {
                        'IdTipoProducto': producto_orden.producto.tipo_producto.IdTipoProducto,
                        'TipoProducto': producto_orden.producto.tipo_producto.TipoProducto,
                    }
                }
            }
            orden_data['ProductosOrden'].append(producto_data)
        
        return jsonify(orden_data), 200
        
    except Exception as e:
        print(f'Error obteniendo orden: {e}')
        return jsonify({'error': 'Error interno del servidor'}), 500

@ordenes_bp.route('/', methods=['POST'])
@jwt_required()
def create_orden():
    try:
        data = request.get_json()
        IdUsuario = data.get('IdUsuario')
        IdMesa = data.get('IdMesa')
        IdEstado = data.get('IdEstado')
        Productos = data.get('Productos', [])
        
        if not IdUsuario or not IdMesa or not IdEstado:
            return jsonify({'error': 'Datos incompletos'}), 400
        
        # Crear orden
        nueva_orden = Orden(
            IdUsuario=IdUsuario,
            IdMesa=IdMesa,
            IdEstado=IdEstado
        )
        db.session.add(nueva_orden)
        db.session.flush()  # Para obtener el IdOrden
        
        # Agregar productos
        for producto in Productos:
            producto_orden = ProductoOrden(
                IdProducto=producto.get('IdProducto'),
                IdOrden=nueva_orden.IdOrden,
                Cantidad=producto.get('Cantidad', 1),
                Notas=producto.get('Notas')
            )
            db.session.add(producto_orden)
        
        db.session.commit()
        
        # Obtener la orden completa
        orden = Orden.query.get(nueva_orden.IdOrden)
        orden_data = {
            'IdOrden': orden.IdOrden,
            'IdUsuario': orden.IdUsuario,
            'IdMesa': orden.IdMesa,
            'IdEstado': orden.IdEstado,
            'FechaCreacion': orden.FechaCreacion.isoformat() if orden.FechaCreacion else None,
        }
        
        return jsonify(orden_data), 201
        
    except Exception as e:
        db.session.rollback()
        print(f'Error creando orden: {e}')
        return jsonify({'error': 'Error interno del servidor'}), 500

@ordenes_bp.route('/<int:id>/estado', methods=['PATCH'])
@jwt_required()
def update_orden_estado(id):
    try:
        data = request.get_json()
        IdEstado = data.get('IdEstado')
        
        if not IdEstado:
            return jsonify({'error': 'IdEstado es requerido'}), 400
        
        orden = Orden.query.get(id)
        if not orden:
            return jsonify({'error': 'Orden no encontrada'}), 404
        
        orden.IdEstado = IdEstado
        db.session.commit()
        
        return jsonify({
            'IdOrden': orden.IdOrden,
            'IdEstado': orden.IdEstado
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f'Error actualizando orden: {e}')
        return jsonify({'error': 'Error interno del servidor'}), 500

@ordenes_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_orden(id):
    try:
        orden = Orden.query.get(id)
        if not orden:
            return jsonify({'error': 'Orden no encontrada'}), 404
        
        # Los productos se eliminan automáticamente por cascade
        db.session.delete(orden)
        db.session.commit()
        
        return jsonify({'message': 'Orden eliminada exitosamente'}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f'Error eliminando orden: {e}')
        return jsonify({'error': 'Error interno del servidor'}), 500

