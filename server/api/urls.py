from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EstadoViewSet, TipoProductoViewSet, TipoUsuarioViewSet,
    ProductoViewSet, UsuarioViewSet, MesaViewSet, OrdenViewSet, AuthViewSet
)

router = DefaultRouter()
router.register(r'estados', EstadoViewSet, basename='estado')
router.register(r'productos', ProductoViewSet, basename='producto')
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'mesas', MesaViewSet, basename='mesa')
router.register(r'ordenes', OrdenViewSet, basename='orden')
router.register(r'auth', AuthViewSet, basename='auth')

urlpatterns = [
    path('', include(router.urls)),
]

