from django.core.management.base import BaseCommand
from datetime import datetime, timedelta
from api.models import (
    Estado, TipoProducto, TipoUsuario, Persona,
    Producto, Usuario, Mesa, Orden, ProductoOrden
)


class Command(BaseCommand):
    help = 'Pobla la base de datos con datos iniciales'

    def handle(self, *args, **options):
        self.stdout.write('🌱 Iniciando seed de la base de datos...')

        # Limpiar datos existentes
        ProductoOrden.objects.all().delete()
        Orden.objects.all().delete()
        Usuario.objects.all().delete()
        Persona.objects.all().delete()
        Producto.objects.all().delete()
        Mesa.objects.all().delete()
        Estado.objects.all().delete()
        TipoProducto.objects.all().delete()
        TipoUsuario.objects.all().delete()

        # Crear Estados
        estados_data = [
            'Activo', 'Pendiente', 'En Preparación', 'Listo',
            'Entregado', 'Cancelado', 'Inactivo'
        ]
        estados = {}
        for estado_nombre in estados_data:
            estado = Estado.objects.create(Estado=estado_nombre)
            estados[estado_nombre] = estado
        self.stdout.write(self.style.SUCCESS('✅ Estados creados'))

        # Crear Tipos de Usuario
        tipos_usuario_data = ['Administrador', 'Mesero', 'Cocina']
        tipos_usuario = {}
        for tipo_nombre in tipos_usuario_data:
            tipo = TipoUsuario.objects.create(TipoUsuario=tipo_nombre)
            tipos_usuario[tipo_nombre] = tipo
        self.stdout.write(self.style.SUCCESS('✅ Tipos de Usuario creados'))

        # Crear Tipos de Producto
        tipos_producto_data = ['Entrada', 'Plato Principal', 'Bebida', 'Postre', 'Acompañamiento']
        tipos_producto = {}
        for tipo_nombre in tipos_producto_data:
            tipo = TipoProducto.objects.create(TipoProducto=tipo_nombre)
            tipos_producto[tipo_nombre] = tipo
        self.stdout.write(self.style.SUCCESS('✅ Tipos de Producto creados'))

        # Crear Personas
        personas_data = [
            {'PrimerNombre': 'Juan', 'PrimerApellido': 'Pérez', 'SegundoApellido': 'García'},
            {'PrimerNombre': 'María', 'PrimerApellido': 'González', 'SegundoApellido': 'López'},
            {'PrimerNombre': 'Carlos', 'PrimerApellido': 'Martínez', 'SegundoApellido': 'Rodríguez'},
            {'PrimerNombre': 'Chef', 'PrimerApellido': 'Principal', 'SegundoApellido': ''},
        ]
        personas = []
        for persona_data in personas_data:
            persona = Persona.objects.create(**persona_data)
            personas.append(persona)
        self.stdout.write(self.style.SUCCESS('✅ Personas creadas'))

        # Crear Usuarios
        usuarios_data = [
            {
                'IdPersona': personas[0],
                'IdTipoUsuario': tipos_usuario['Administrador'],
                'Username': 'admin',
                'Password': 'admin123',
                'IdEstado': estados['Activo']
            },
            {
                'IdPersona': personas[1],
                'IdTipoUsuario': tipos_usuario['Mesero'],
                'Username': 'maria',
                'Password': 'mesero123',
                'IdEstado': estados['Activo']
            },
            {
                'IdPersona': personas[2],
                'IdTipoUsuario': tipos_usuario['Mesero'],
                'Username': 'carlos',
                'Password': 'mesero123',
                'IdEstado': estados['Activo']
            },
            {
                'IdPersona': personas[3],
                'IdTipoUsuario': tipos_usuario['Cocina'],
                'Username': 'cocina',
                'Password': 'cocina123',
                'IdEstado': estados['Activo']
            },
        ]
        usuarios = []
        for usuario_data in usuarios_data:
            password = usuario_data.pop('Password')
            usuario = Usuario.objects.create(**usuario_data)
            usuario.set_password(password)
            usuario.save()
            usuarios.append(usuario)
        self.stdout.write(self.style.SUCCESS('✅ Usuarios creados'))

        # Crear Mesas
        mesas = []
        for i in range(1, 11):
            mesa = Mesa.objects.create(Mesa=f'Mesa {i}')
            mesas.append(mesa)
        self.stdout.write(self.style.SUCCESS('✅ Mesas creadas'))

        # Crear Productos
        productos_data = [
            {'IdTipoProducto': tipos_producto['Plato Principal'], 'NombreProducto': 'Pizza Margherita', 'Valor': 12000, 'IdEstado': estados['Activo']},
            {'IdTipoProducto': tipos_producto['Plato Principal'], 'NombreProducto': 'Pizza Pepperoni', 'Valor': 14000, 'IdEstado': estados['Activo']},
            {'IdTipoProducto': tipos_producto['Plato Principal'], 'NombreProducto': 'Hamburguesa Clásica', 'Valor': 10000, 'IdEstado': estados['Activo']},
            {'IdTipoProducto': tipos_producto['Plato Principal'], 'NombreProducto': 'Hamburguesa BBQ', 'Valor': 12000, 'IdEstado': estados['Activo']},
            {'IdTipoProducto': tipos_producto['Plato Principal'], 'NombreProducto': 'Pasta Carbonara', 'Valor': 13000, 'IdEstado': estados['Activo']},
            {'IdTipoProducto': tipos_producto['Plato Principal'], 'NombreProducto': 'Pasta Bolognesa', 'Valor': 13000, 'IdEstado': estados['Activo']},
            {'IdTipoProducto': tipos_producto['Entrada'], 'NombreProducto': 'Ensalada César', 'Valor': 8000, 'IdEstado': estados['Activo']},
            {'IdTipoProducto': tipos_producto['Entrada'], 'NombreProducto': 'Ensalada Mixta', 'Valor': 7000, 'IdEstado': estados['Activo']},
            {'IdTipoProducto': tipos_producto['Acompañamiento'], 'NombreProducto': 'Papas Fritas', 'Valor': 4000, 'IdEstado': estados['Activo']},
            {'IdTipoProducto': tipos_producto['Acompañamiento'], 'NombreProducto': 'Aros de Cebolla', 'Valor': 4500, 'IdEstado': estados['Activo']},
            {'IdTipoProducto': tipos_producto['Entrada'], 'NombreProducto': 'Alitas de Pollo', 'Valor': 9000, 'IdEstado': estados['Activo']},
            {'IdTipoProducto': tipos_producto['Entrada'], 'NombreProducto': 'Nachos', 'Valor': 8000, 'IdEstado': estados['Activo']},
            {'IdTipoProducto': tipos_producto['Bebida'], 'NombreProducto': 'Refresco', 'Valor': 2500, 'IdEstado': estados['Activo']},
            {'IdTipoProducto': tipos_producto['Bebida'], 'NombreProducto': 'Jugo Natural', 'Valor': 3000, 'IdEstado': estados['Activo']},
            {'IdTipoProducto': tipos_producto['Bebida'], 'NombreProducto': 'Cerveza', 'Valor': 4000, 'IdEstado': estados['Activo']},
            {'IdTipoProducto': tipos_producto['Bebida'], 'NombreProducto': 'Vino', 'Valor': 15000, 'IdEstado': estados['Activo']},
            {'IdTipoProducto': tipos_producto['Postre'], 'NombreProducto': 'Tiramisú', 'Valor': 6000, 'IdEstado': estados['Activo']},
            {'IdTipoProducto': tipos_producto['Postre'], 'NombreProducto': 'Helado', 'Valor': 5000, 'IdEstado': estados['Activo']},
        ]
        productos = []
        for producto_data in productos_data:
            producto = Producto.objects.create(**producto_data)
            productos.append(producto)
        self.stdout.write(self.style.SUCCESS('✅ Productos creados'))

        # Crear Órdenes de ejemplo
        fecha1 = datetime.now() - timedelta(minutes=15)
        fecha2 = datetime.now() - timedelta(minutes=5)
        fecha3 = datetime.now() - timedelta(minutes=25)

        ordenes_data = [
            {'IdUsuario': usuarios[2], 'IdMesa': mesas[4], 'IdEstado': estados['En Preparación'], 'FechaCreacion': fecha1},
            {'IdUsuario': usuarios[1], 'IdMesa': mesas[2], 'IdEstado': estados['Pendiente'], 'FechaCreacion': fecha2},
            {'IdUsuario': usuarios[2], 'IdMesa': mesas[7], 'IdEstado': estados['Listo'], 'FechaCreacion': fecha3},
        ]
        ordenes = []
        for orden_data in ordenes_data:
            orden = Orden.objects.create(**orden_data)
            ordenes.append(orden)
        self.stdout.write(self.style.SUCCESS('✅ Órdenes creadas'))

        # Crear ProductosOrden
        productos_orden_data = [
            {'IdProducto': productos[0], 'IdOrden': ordenes[0], 'Cantidad': 2},
            {'IdProducto': productos[6], 'IdOrden': ordenes[0], 'Cantidad': 1},
            {'IdProducto': productos[2], 'IdOrden': ordenes[1], 'Cantidad': 3, 'Notas': 'Sin cebolla'},
            {'IdProducto': productos[8], 'IdOrden': ordenes[1], 'Cantidad': 2},
            {'IdProducto': productos[4], 'IdOrden': ordenes[2], 'Cantidad': 1},
        ]
        for producto_orden_data in productos_orden_data:
            ProductoOrden.objects.create(**producto_orden_data)
        self.stdout.write(self.style.SUCCESS('✅ Productos de órdenes creados'))

        self.stdout.write(self.style.SUCCESS('\n🎉 Base de datos inicializada exitosamente!'))
        self.stdout.write('\n📝 Usuarios de prueba:')
        self.stdout.write('   - admin / admin123 (Administrador)')
        self.stdout.write('   - maria / mesero123 (Mesero)')
        self.stdout.write('   - carlos / mesero123 (Mesero)')
        self.stdout.write('   - cocina / cocina123 (Cocina)')

