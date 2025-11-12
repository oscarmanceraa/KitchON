from django.contrib import admin
from .models import (
    Estado, TipoProducto, TipoUsuario, Persona,
    Producto, Usuario, Mesa, Orden, ProductoOrden
)

admin.site.register(Estado)
admin.site.register(TipoProducto)
admin.site.register(TipoUsuario)
admin.site.register(Persona)
admin.site.register(Producto)
admin.site.register(Usuario)
admin.site.register(Mesa)
admin.site.register(Orden)
admin.site.register(ProductoOrden)

