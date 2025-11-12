# Backend Django - Restaurant Order Management API

Backend desarrollado con Django y Django REST Framework para la aplicación de gestión de órdenes de restaurante.

## 🚀 Instalación

1. **Crear entorno virtual (recomendado):**
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

2. **Instalar dependencias:**
```bash
pip install -r requirements.txt
```

3. **Configurar variables de entorno:**
```bash
# Crear archivo .env en la raíz del proyecto server/
# Variables opcionales:
# SECRET_KEY=tu-secret-key
# FRONTEND_URL=http://localhost:5173
```

4. **Ejecutar migraciones:**
```bash
python manage.py migrate
```

5. **Poblar la base de datos con datos iniciales:**
```bash
python manage.py seed_db
```

6. **Ejecutar el servidor:**
```bash
python manage.py runserver
```

El servidor estará disponible en `http://localhost:8000` (o el puerto configurado).

## 📡 Endpoints API

### Autenticación
- `POST /api/auth/login/` - Iniciar sesión
- `GET /api/auth/verify/` - Verificar token (requiere JWT)

### Órdenes
- `GET /api/ordenes/` - Obtener todas las órdenes
- `GET /api/ordenes/<id>/` - Obtener una orden por ID
- `POST /api/ordenes/` - Crear una nueva orden
- `PATCH /api/ordenes/<id>/estado/` - Actualizar estado de una orden
- `DELETE /api/ordenes/<id>/` - Eliminar una orden

### Productos
- `GET /api/productos/` - Obtener todos los productos
- `GET /api/productos/<id>/` - Obtener un producto por ID
- `POST /api/productos/` - Crear un nuevo producto
- `PUT /api/productos/<id>/` - Actualizar un producto
- `DELETE /api/productos/<id>/` - Eliminar un producto

### Usuarios
- `GET /api/usuarios/` - Obtener todos los usuarios

### Mesas
- `GET /api/mesas/` - Obtener todas las mesas

### Estados
- `GET /api/estados/` - Obtener todos los estados

## 🔐 Usuarios de Prueba

Después de ejecutar `python manage.py seed_db`, puedes usar estos usuarios:

- **Administrador:** `admin` / `admin123`
- **Mesero:** `maria` / `mesero123` o `carlos` / `mesero123`
- **Cocina:** `cocina` / `cocina123`

## 🗄️ Base de Datos

Por defecto se usa SQLite (`db.sqlite3`). Para cambiar a PostgreSQL u otra base de datos, modifica `DATABASES` en `restaurant_backend/settings.py`.

## 📝 Estructura del Proyecto

```
server/
├── manage.py              # Script de gestión de Django
├── restaurant_backend/     # Configuración del proyecto
│   ├── settings.py        # Configuración
│   ├── urls.py            # URLs principales
│   └── wsgi.py            # WSGI config
├── api/                   # Aplicación API
│   ├── models.py          # Modelos de base de datos
│   ├── serializers.py     # Serializers para la API
│   ├── views.py           # ViewSets
│   ├── urls.py            # URLs de la API
│   └── management/
│       └── commands/
│           └── seed_db.py # Comando para poblar BD
└── requirements.txt       # Dependencias Python
```

## 🔧 Comandos Útiles

```bash
# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superusuario para admin
python manage.py createsuperuser

# Poblar base de datos
python manage.py seed_db

# Ejecutar servidor
python manage.py runserver
```
