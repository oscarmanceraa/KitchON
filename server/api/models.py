from django.db import models
from django.contrib.auth.hashers import make_password, check_password


class Estado(models.Model):
    IdEstado = models.AutoField(primary_key=True)
    Estado = models.CharField(max_length=50, unique=True)

    class Meta:
        db_table = 'estado'
        ordering = ['IdEstado']

    def __str__(self):
        return self.Estado


class TipoProducto(models.Model):
    IdTipoProducto = models.AutoField(primary_key=True)
    TipoProducto = models.CharField(max_length=50, unique=True)

    class Meta:
        db_table = 'tipo_producto'
        ordering = ['IdTipoProducto']

    def __str__(self):
        return self.TipoProducto


class TipoUsuario(models.Model):
    IdTipoUsuario = models.AutoField(primary_key=True)
    TipoUsuario = models.CharField(max_length=50, unique=True)

    class Meta:
        db_table = 'tipo_usuario'
        ordering = ['IdTipoUsuario']

    def __str__(self):
        return self.TipoUsuario


class Persona(models.Model):
    idPersona = models.AutoField(primary_key=True)
    PrimerNombre = models.CharField(max_length=50)
    SegundoNombre = models.CharField(max_length=50, blank=True, null=True)
    PrimerApellido = models.CharField(max_length=50)
    SegundoApellido = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        db_table = 'persona'
        ordering = ['idPersona']

    def __str__(self):
        return f"{self.PrimerNombre} {self.PrimerApellido}"


class Producto(models.Model):
    IdProducto = models.AutoField(primary_key=True)
    IdTipoProducto = models.ForeignKey(TipoProducto, on_delete=models.CASCADE, db_column='IdTipoProducto')
    NombreProducto = models.CharField(max_length=100)
    Valor = models.FloatField()
    IdEstado = models.ForeignKey(Estado, on_delete=models.CASCADE, db_column='IdEstado')

    class Meta:
        db_table = 'producto'
        ordering = ['IdProducto']

    def __str__(self):
        return self.NombreProducto


class Usuario(models.Model):
    IdUsuario = models.AutoField(primary_key=True)
    IdPersona = models.ForeignKey(Persona, on_delete=models.CASCADE, db_column='IdPersona')
    IdTipoUsuario = models.ForeignKey(TipoUsuario, on_delete=models.CASCADE, db_column='IdTipoUsuario')
    Username = models.CharField(max_length=50, unique=True)
    Password = models.CharField(max_length=255)
    IdEstado = models.ForeignKey(Estado, on_delete=models.CASCADE, db_column='IdEstado')

    class Meta:
        db_table = 'usuario'
        ordering = ['IdUsuario']

    def __str__(self):
        return self.Username

    def set_password(self, raw_password):
        import bcrypt
        self.Password = bcrypt.hashpw(raw_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, raw_password):
        import bcrypt
        return bcrypt.checkpw(raw_password.encode('utf-8'), self.Password.encode('utf-8'))


class Mesa(models.Model):
    IdMesa = models.AutoField(primary_key=True)
    Mesa = models.CharField(max_length=50, unique=True)

    class Meta:
        db_table = 'mesa'
        ordering = ['IdMesa']

    def __str__(self):
        return self.Mesa


class Orden(models.Model):
    IdOrden = models.AutoField(primary_key=True)
    IdUsuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='IdUsuario')
    IdMesa = models.ForeignKey(Mesa, on_delete=models.CASCADE, db_column='IdMesa')
    IdEstado = models.ForeignKey(Estado, on_delete=models.CASCADE, db_column='IdEstado')
    FechaCreacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'orden'
        ordering = ['-FechaCreacion']

    def __str__(self):
        return f"Orden {self.IdOrden} - Mesa {self.IdMesa.Mesa}"


class ProductoOrden(models.Model):
    IdProducto = models.ForeignKey(Producto, on_delete=models.CASCADE, db_column='IdProducto')
    IdOrden = models.ForeignKey(Orden, on_delete=models.CASCADE, db_column='IdOrden', related_name='productos_orden')
    Cantidad = models.IntegerField(default=1)
    Notas = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'producto_orden'
        unique_together = [['IdProducto', 'IdOrden']]

    def __str__(self):
        return f"{self.IdProducto.NombreProducto} x{self.Cantidad} - Orden {self.IdOrden.IdOrden}"

