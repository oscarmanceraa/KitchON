
# Restaurant Order Management App

Sistema de gestión de órdenes para restaurante con frontend en React y backend en Django.

## 🚀 Inicio Rápido

### Backend (Django)

1. **Navegar a la carpeta del servidor:**
```bash
cd server
```

2. **Crear entorno virtual (recomendado):**
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. **Instalar dependencias:**
```bash
pip install -r requirements.txt
```

4. **Configurar variables de entorno (opcional):**
```bash
# Crear archivo .env si necesitas configuraciones personalizadas
# SECRET_KEY=tu-secret-key
# FRONTEND_URL=http://localhost:5173
```

5. **Ejecutar migraciones (esto creará automáticamente los usuarios de prueba):**
```bash
python manage.py migrate
```

**Nota:** Las migraciones incluyen automáticamente los usuarios de prueba y datos iniciales.

6. **Ejecutar el servidor:**
```bash
python manage.py runserver
```

El servidor estará disponible en `http://localhost:8000`

### Frontend (React)

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
```bash
# Crear archivo .env en la raíz del proyecto
VITE_API_URL=http://localhost:8000
```

3. **Ejecutar el servidor de desarrollo:**
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173` (o el puerto que Vite asigne)

## 🔐 Usuarios de Prueba

Los usuarios de prueba se crean automáticamente al ejecutar las migraciones. Puedes usar estos usuarios:

- **Administrador:** `admin` / `admin123`
- **Mesero:** `maria` / `mesero123` o `carlos` / `mesero123`
- **Cocina:** `cocina` / `cocina123`

## 📁 Estructura del Proyecto

```
.
├── server/              # Backend Django
│   ├── manage.py       # Script de gestión de Django
│   ├── restaurant_backend/  # Configuración del proyecto
│   │   ├── settings.py # Configuración
│   │   └── urls.py     # URLs principales
│   └── api/            # Aplicación API
│       ├── models.py    # Modelos de base de datos
│       ├── views.py     # ViewSets
│       └── urls.py      # URLs de la API
├── src/                # Frontend React
│   ├── components/     # Componentes React
│   ├── lib/           # Utilidades y API
│   └── types/         # Tipos TypeScript
└── README.md
```

## 🔧 Tecnologías

### Backend
- Django + Django REST Framework
- SQLite (desarrollo) / PostgreSQL (producción)
- JWT para autenticación (Simple JWT)

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Radix UI

## 📡 API Endpoints

Ver documentación completa en `server/README.md`

### Nota sobre URLs

Las URLs de Django REST Framework terminan con `/` (slash final). Por ejemplo:
- `/api/auth/login/` (no `/api/auth/login`)
- `/api/ordenes/` (no `/api/ordenes`)

El frontend ya está configurado para usar estas URLs correctamente.
  