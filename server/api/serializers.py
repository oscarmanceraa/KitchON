from rest_framework import serializers
from .models import (
    Estado, TipoProducto, TipoUsuario, Persona,
    Producto, Usuario, Mesa, Orden, ProductoOrden
)
from django.db import models


class EstadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estado
        fields = ['IdEstado', 'Estado']


class TipoProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoProducto
        fields = ['IdTipoProducto', 'TipoProducto']


class TipoUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoUsuario
        fields = ['IdTipoUsuario', 'TipoUsuario']


class PersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Persona
        fields = ['idPersona', 'PrimerNombre', 'SegundoNombre', 'PrimerApellido', 'SegundoApellido']


class ProductoSerializer(serializers.ModelSerializer):
    TipoProducto = TipoProductoSerializer(read_only=True, source='IdTipoProducto')
    Estado = EstadoSerializer(read_only=True, source='IdEstado')
    
    class Meta:
        model = Producto
        fields = ['IdProducto', 'IdTipoProducto', 'NombreProducto', 'Valor', 'IdEstado', 'TipoProducto', 'Estado']


class UsuarioSerializer(serializers.ModelSerializer):
    Persona = PersonaSerializer(read_only=True, source='IdPersona')
    TipoUsuario = TipoUsuarioSerializer(read_only=True, source='IdTipoUsuario')
    Estado = EstadoSerializer(read_only=True, source='IdEstado')
    Password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Usuario
        fields = ['IdUsuario', 'IdPersona', 'IdTipoUsuario', 'Username', 'Password', 'IdEstado', 'Persona', 'TipoUsuario', 'Estado']

    def create(self, validated_data):
        password = validated_data.pop('Password', None)
        usuario = Usuario.objects.create(**validated_data)
        if password:
            usuario.set_password(password)
            usuario.save()
        return usuario


class MesaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mesa
        fields = ['IdMesa', 'Mesa']


class ProductoOrdenSerializer(serializers.ModelSerializer):
    Producto = ProductoSerializer(read_only=True, source='IdProducto')

    class Meta:
        model = ProductoOrden
        fields = ['IdProducto', 'IdOrden', 'Cantidad', 'Notas', 'Producto']


class OrdenSerializer(serializers.ModelSerializer):
    Usuario = UsuarioSerializer(read_only=True, source='IdUsuario')
    Mesa = MesaSerializer(read_only=True, source='IdMesa')
    Estado = EstadoSerializer(read_only=True, source='IdEstado')
    ProductosOrden = ProductoOrdenSerializer(many=True, read_only=True, source='productos_orden')

    class Meta:
        model = Orden
        fields = ['IdOrden', 'IdUsuario', 'IdMesa', 'IdEstado', 'FechaCreacion', 'Usuario', 'Mesa', 'Estado', 'ProductosOrden']


class CreateOrdenSerializer(serializers.Serializer):
    IdUsuario = serializers.IntegerField()
    IdMesa = serializers.IntegerField()
    IdEstado = serializers.IntegerField()
    Productos = serializers.ListField(
        child=serializers.DictField()
    )

