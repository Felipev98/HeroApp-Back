# Backend Hero App API

API REST para la gestión de héroes con autenticación mediante AWS Cognito y persistencia en MongoDB.

## 🚀 Características

- ✅ CRUD completo de héroes (Crear, Leer, Actualizar, Eliminar)
- ✅ Marcar héroe como completado
- ✅ Autenticación con AWS Cognito (Registro e Inicio de Sesión)
- ✅ Protección de rutas mediante tokens JWT
- ✅ Validación de datos de entrada con express-validator
- ✅ Manejo centralizado de errores
- ✅ Persistencia de datos con MongoDB (Mongoose)
- ✅ Tests unitarios con Jest y Supertest
- ✅ Arquitectura modular (services, controllers, validators, utils)

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn
- Cuenta de AWS con Cognito configurado
- MongoDB (local o MongoDB Atlas)

## 🔧 Instalación

1. Clonar el repositorio (o navegar al directorio del proyecto)

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Editar el archivo `.env` con tus credenciales:

```env
# Puerto del servidor
PORT=5001

# MongoDB
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/hero-app?retryWrites=true&w=majority

# AWS Cognito
AWS_COGNITO_REGION=us-east-1
AWS_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
AWS_COGNITO_CLIENT_ID=tu-client-id
AWS_COGNITO_CLIENT_SECRET=tu-client-secret  # Opcional, solo si tu App Client tiene secret

# AWS Credentials (para operaciones administrativas de Cognito)
AWS_ACCESS_KEY_ID=tu-access-key-id
AWS_SECRET_ACCESS_KEY=tu-secret-access-key
```

## 🏃 Ejecución

### Modo desarrollo (con nodemon):
```bash
npm run dev
```

### Modo producción:
```bash
npm start
```

El servidor estará disponible en `http://localhost:5001`

### Tests:
```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test:coverage
```

## 📡 Endpoints

### Health Check
- **GET** `/health` - Verificar estado del servidor

### Autenticación (No requieren autenticación)

- **POST** `/api/auth/register` - Registrar un nuevo usuario
  ```json
  {
    "username": "usuario",
    "email": "usuario@example.com",
    "password": "contraseña123"
  }
  ```

- **POST** `/api/auth/login` - Iniciar sesión
  ```json
  {
    "email": "usuario@example.com",
    "password": "contraseña123"
  }
  ```

### Héroes (Requieren autenticación mediante token JWT)

Todas las rutas requieren autenticación mediante token JWT en el header `Authorization: Bearer <token>`

- **GET** `/api/heroes` - Obtener todos los héroes del usuario autenticado
- **GET** `/api/heroes/:id` - Obtener un héroe por ID
- **POST** `/api/heroes` - Crear un nuevo héroe
  ```json
  {
    "name": "Superman",
    "description": "El hombre de acero",
    "power": "Vuelo y super fuerza"
  }
  ```
- **PUT** `/api/heroes/:id` - Actualizar un héroe
- **DELETE** `/api/heroes/:id` - Eliminar un héroe
- **PUT** `/api/heroes/:id/done` - Marcar héroe como completado

### Uso del Token

El frontend debe incluir el token JWT obtenido de Cognito en cada petición:

```
Authorization: Bearer <token-jwt-de-cognito>
```

## 📝 Ejemplos de Uso

### Registrar un nuevo usuario
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "superman",
    "email": "superman@example.com",
    "password": "Superman123$"
  }'
```

### Iniciar sesión
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superman@example.com",
    "password": "Superman123$"
  }'
```

### Crear un héroe
```bash
curl -X POST http://localhost:5001/api/heroes \
  -H "Authorization: Bearer <tu-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Superman",
    "description": "El hombre de acero",
    "power": "Vuelo y super fuerza"
  }'
```

### Obtener todos los héroes
```bash
curl -X GET http://localhost:5001/api/heroes \
  -H "Authorization: Bearer <tu-token>"
```

### Marcar héroe como completado
```bash
curl -X PUT http://localhost:5001/api/heroes/507f1f77bcf86cd799439011/done \
  -H "Authorization: Bearer <tu-token>"
```

## 📦 Estructura del Proyecto

```
Backend_Hero_App/
├── src/
│   ├── __tests__/              # Tests unitarios
│   │   ├── auth.test.js
│   │   ├── heroes.test.js
│   │   └── setup.js
│   ├── config/
│   │   ├── cognito.js          # Configuración de AWS Cognito
│   │   └── database.js         # Configuración de MongoDB
│   ├── constants/
│   │   ├── messages.js         # Mensajes constantes
│   │   └── statusCodes.js       # Códigos de estado HTTP
│   ├── controllers/
│   │   ├── authController.js   # Controlador de autenticación
│   │   └── heroesController.js # Controlador de héroes
│   ├── errors/
│   │   └── AppError.js         # Clases de errores personalizados
│   ├── middleware/
│   │   ├── auth.js             # Middleware de autenticación JWT
│   │   └── errorHandler.js     # Manejo centralizado de errores
│   ├── models/
│   │   └── hero.js             # Modelo de Mongoose para Hero
│   ├── routes/
│   │   ├── auth.js             # Rutas de autenticación
│   │   └── heroes.js           # Rutas de héroes
│   ├── services/
│   │   ├── authService.js      # Lógica de negocio de autenticación
│   │   └── heroService.js      # Lógica de negocio de héroes
│   ├── utils/
│   │   ├── responseHelper.js   # Helper para respuestas HTTP
│   │   └── validationHelper.js # Helper para validaciones
│   ├── validators/
│   │   ├── authValidator.js    # Validaciones de autenticación
│   │   └── heroValidator.js    # Validaciones de héroes
│   └── index.js                # Punto de entrada de la aplicación
├── .env                        # Variables de entorno (no versionado)
├── .env.example                # Ejemplo de variables de entorno
├── jest.config.js              # Configuración de Jest
├── package.json
└── README.md
```

## 🧪 Testing

El proyecto incluye tests unitarios usando Jest y Supertest:

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch
```

Los tests están ubicados en `src/__tests__/` y cubren:
- Endpoints de autenticación (registro e inicio de sesión)
- Protección de rutas de héroes (verificación de autenticación)

## 🔒 Validaciones

### Héroes
- **name**: Requerido, entre 2 y 100 caracteres
- **description**: Opcional, máximo 60000 caracteres
- **power**: Opcional, máximo 100 caracteres

### Autenticación
- **username**: Requerido, mínimo 3 caracteres
- **email**: Requerido, formato de email válido
- **password**: Requerido, mínimo 6 caracteres (puede variar según política de Cognito)

## 🛠️ Tecnologías Utilizadas

- **Express.js** - Framework web para Node.js
- **MongoDB + Mongoose** - Base de datos y ODM
- **AWS Cognito** - Servicio de autenticación
- **JWT** - Tokens de autenticación
- **express-validator** - Validación de datos
- **Jest + Supertest** - Testing
- **dotenv** - Gestión de variables de entorno

## 📄 Licencia

ISC
