from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from .models import (
    Estado, TipoProducto, TipoUsuario, Persona,
    Producto, Usuario, Mesa, Orden, ProductoOrden
)
from .serializers import (
    EstadoSerializer, TipoProductoSerializer, TipoUsuarioSerializer,
    PersonaSerializer, ProductoSerializer, UsuarioSerializer,
    MesaSerializer, OrdenSerializer, CreateOrdenSerializer
)


class EstadoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Estado.objects.all()
    serializer_class = EstadoSerializer


class TipoProductoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TipoProducto.objects.all()
    serializer_class = TipoProductoSerializer


class TipoUsuarioViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TipoUsuario.objects.all()
    serializer_class = TipoUsuarioSerializer


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.select_related('IdTipoProducto', 'IdEstado').all()
    serializer_class = ProductoSerializer


class UsuarioViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Usuario.objects.select_related('IdPersona', 'IdTipoUsuario', 'IdEstado').all()
    serializer_class = UsuarioSerializer


class MesaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Mesa.objects.all()
    serializer_class = MesaSerializer


class OrdenViewSet(viewsets.ModelViewSet):
    queryset = Orden.objects.select_related(
        'IdUsuario', 'IdUsuario__IdPersona', 'IdUsuario__IdTipoUsuario',
        'IdMesa', 'IdEstado'
    ).prefetch_related('productos_orden__IdProducto__IdTipoProducto').all()
    serializer_class = OrdenSerializer

    def create(self, request, *args, **kwargs):
        serializer = CreateOrdenSerializer(data=request.data)
        if serializer.is_valid():
            orden = Orden.objects.create(
                IdUsuario_id=serializer.validated_data['IdUsuario'],
                IdMesa_id=serializer.validated_data['IdMesa'],
                IdEstado_id=serializer.validated_data['IdEstado']
            )
            
            # Crear productos de la orden
            for producto_data in serializer.validated_data['Productos']:
                ProductoOrden.objects.create(
                    IdProducto_id=producto_data['IdProducto'],
                    IdOrden=orden,
                    Cantidad=producto_data.get('Cantidad', 1),
                    Notas=producto_data.get('Notas')
                )
            
            response_serializer = OrdenSerializer(orden)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'])
    def estado(self, request, pk=None):
        orden = self.get_object()
        nuevo_estado_id = request.data.get('IdEstado')
        
        if not nuevo_estado_id:
            return Response({'error': 'IdEstado es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            estado = Estado.objects.get(pk=nuevo_estado_id)
            orden.IdEstado = estado
            orden.save()
            serializer = self.get_serializer(orden)
            return Response(serializer.data)
        except Estado.DoesNotExist:
            return Response({'error': 'Estado no encontrado'}, status=status.HTTP_404_NOT_FOUND)


class AuthViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': 'Username y password son requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            usuario = Usuario.objects.select_related(
                'IdPersona', 'IdTipoUsuario', 'IdEstado'
            ).get(Username=username)
        except Usuario.DoesNotExist:
            return Response(
                {'error': 'Credenciales inválidas'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if usuario.IdEstado.Estado != 'Activo':
            return Response(
                {'error': 'Usuario inactivo'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not usuario.check_password(password):
            return Response(
                {'error': 'Credenciales inválidas'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Generar token JWT
        refresh = RefreshToken()
        refresh['IdUsuario'] = usuario.IdUsuario
        refresh['Username'] = usuario.Username
        refresh['IdTipoUsuario'] = usuario.IdTipoUsuario.IdTipoUsuario
        
        access_token = refresh.access_token
        
        usuario_serializer = UsuarioSerializer(usuario)
        
        return Response({
            'usuario': usuario_serializer.data,
            'token': str(access_token)
        })

    @action(detail=False, methods=['get'])
    def verify(self, request):
        # La autenticación se maneja por el middleware JWT
        # El token JWT contiene el IdUsuario en el claim
        from rest_framework_simplejwt.tokens import UntypedToken
        from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
        
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return Response(
                {'error': 'Token no proporcionado'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        try:
            token = auth_header.split(' ')[1]
            untyped_token = UntypedToken(token)
            usuario_id = untyped_token.get('IdUsuario')
            
            usuario = Usuario.objects.select_related(
                'IdPersona', 'IdTipoUsuario', 'IdEstado'
            ).get(pk=usuario_id)
            
            if usuario.IdEstado.Estado != 'Activo':
                return Response(
                    {'error': 'Usuario inactivo'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            usuario_serializer = UsuarioSerializer(usuario)
            return Response({'usuario': usuario_serializer.data})
        except (TokenError, InvalidToken, Usuario.DoesNotExist, KeyError):
            return Response(
                {'error': 'Token inválido'},
                status=status.HTTP_401_UNAUTHORIZED
            )

