# Jobdossier

Jobdossier es una plataforma full-stack para descubrir, filtrar y analizar ofertas de empleo tecnológicas.

La idea detrás del proyecto es resolver un problema muy real: buscar trabajo en tech suele implicar revisar muchas ofertas dispersas, filtrar resultados manualmente, guardar criterios repetidos y tratar de entender el mercado sin herramientas claras. Este proyecto unifica esa experiencia y añade una capa de analítica con microservicios para ir más allá del simple listado de ofertas.

## Demo

- Frontend: [https://jobdossier.vercel.app](https://jobdossier.vercel.app)
- Backend API: [https://jobdossier.onrender.com](https://jobdossier.onrender.com)
- Analytics service: `https://jobdossier-analytics.onrender.com`
- Swagger NestJS: [https://jobdossier.onrender.com/api](https://jobdossier.onrender.com/api)

## Qué hace

- Permite registro e inicio de sesión con JWT
- Recupera y persiste ofertas de empleo tech en PostgreSQL
- Permite buscar y filtrar ofertas por texto, ubicación y modalidad
- Permite guardar filtros personalizados por usuario
- Emite notificaciones en tiempo real cuando aparecen nuevas ofertas relevantes
- Expone una API REST documentada con Swagger
- Incluye un microservicio Spring Boot para analítica
- Muestra métricas de mercado como empresas top, tecnologías top y salario por stack
- Incluye un frontend React para autenticación, dashboard, filtros y visualización de ofertas

## Stack técnico

### Backend

- NestJS
- TypeScript
- Prisma
- PostgreSQL
- JWT
- Swagger
- Jest
- Socket.IO
- `@nestjs/schedule`

### Frontend

- React
- TypeScript
- Vite
- Axios
- React Router
- Socket.IO client

### Microservicio de analytics

- Java 21
- Spring Boot
- Spring Data JPA
- PostgreSQL
- Spring Actuator
- Springdoc OpenAPI
- JUnit 5

### Infraestructura

- Docker
- Docker Compose
- GitHub Actions
- Render
- Neon
- Vercel

## Arquitectura general

El backend principal está dividido en módulos por responsabilidad:

- `auth`: registro, login y validación JWT
- `offers`: lectura y consulta de ofertas
- `filters`: filtros guardados por usuario
- `fetcher`: importación y orquestación de ofertas
- `notifications`: WebSockets y eventos en tiempo real
- `analytics`: BFF que consume el microservicio Spring Boot
- `prisma`: acceso a base de datos

El frontend React vive en la carpeta `frontend`.

El microservicio Spring Boot vive en la carpeta `analytics-service` y se encarga solo de la parte analítica.

## Flujo principal

1. El usuario se registra o inicia sesión
2. El backend emite un JWT propio
3. El frontend guarda el token y protege las rutas privadas
4. El usuario consulta ofertas y aplica filtros
5. El usuario puede guardar filtros personalizados
6. El backend importa nuevas ofertas de forma programada
7. Si aparecen ofertas relevantes, el backend emite eventos por WebSocket
8. El frontend actualiza el dashboard en tiempo real
9. El frontend consulta analytics al backend NestJS
10. NestJS delega la consulta al microservicio Spring Boot
11. Spring Boot calcula y devuelve las métricas desde PostgreSQL

## Automatización

La importación periódica de ofertas se ejecuta desde el propio backend NestJS usando `@nestjs/schedule`.

El proceso programado llama a la orquestación del fetcher y persiste nuevas ofertas en la base de datos. Si alguna coincide con filtros guardados, se emite una notificación por WebSocket al usuario correspondiente.

Este enfoque simplifica la infraestructura y evita depender de Redis o BullMQ para un caso de uso que aquí se resuelve mejor con scheduling nativo.

## Ejecución en local

### Requisitos

- Docker
- Docker Compose
- Node.js 20+
- Java 21

### Variables de entorno

Debes configurar variables de entorno para backend, frontend y analytics.

Especialmente:

- `DATABASE_URL`
- `JWT_SECRET`
- `ANALYTICS_SERVICE_URL`
- `FRONTEND_URL`
- `ADZUNA_APP_ID`
- `ADZUNA_APP_KEY`
- `ANALYTICS_DATASOURCE_URL`
- `ANALYTICS_DATASOURCE_USERNAME`
- `ANALYTICS_DATASOURCE_PASSWORD`
- `VITE_API_URL`

### Levantar backend, analytics y base de datos

Desde la raíz del proyecto:

```bash
docker compose up --build
```

Esto levanta:

- backend NestJS
- microservicio Spring Boot
- PostgreSQL

### Levantar frontend React

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

El frontend quedará disponible en:

```txt
http://localhost:5173
```

### Levantar Spring Boot manualmente

En Git Bash:

```bash
cd analytics-service
./mvnw test
./mvnw spring-boot:run
```

En PowerShell:

```powershell
cd analytics-service
.\mvnw.cmd test
.\mvnw.cmd spring-boot:run
```

## Tests y build

### Backend NestJS

Desde la raíz del proyecto:

```bash
npm install
npm test
npm run build
```

### Frontend React

Desde `frontend`:

```bash
npm install
npm test
npm run build
```

### Microservicio Spring Boot

Desde `analytics-service`:

```bash
./mvnw test
```

## API y documentación

Cuando el backend está arrancado, Swagger queda disponible en:

```txt
http://localhost:3000/api
```

En producción:

```txt
https://jobdossier.onrender.com/api
```

Cuando el microservicio Spring Boot está arrancado:

```txt
http://localhost:8080/swagger-ui.html
```

En local también dispone de healthcheck en:

```txt
http://localhost:8080/actuator/health
```

## Rutas principales del frontend

- `/login`
- `/register`
- `/dashboard`

## Estado del proyecto

Actualmente el proyecto incluye:

- autenticación con JWT
- persistencia de usuarios y filtros
- consulta de ofertas
- filtros guardados por usuario
- importación programada de ofertas
- notificaciones en tiempo real por WebSocket
- microservicio Spring Boot de analytics
- frontend React funcional
- CI con GitHub Actions
- despliegue full-stack funcionando en producción

## Deploy actual

### Frontend

- Vercel
- [https://jobdossier.vercel.app](https://jobdossier.vercel.app)

### Backend principal

- Render
- [https://jobdossier.onrender.com](https://jobdossier.onrender.com)

### Microservicio analytics

- Render
- `jobdossier-analytics`

### Base de datos

- Neon PostgreSQL
- `DATABASE_URL` para Prisma
- conexión JDBC separada para Spring Boot

## Checklist de deploy

Para publicar el proyecto en producción:

1. Crear la base de datos en Neon
2. Configurar en Render el backend NestJS con:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `ANALYTICS_SERVICE_URL`
   - `FRONTEND_URL`
   - `ADZUNA_APP_ID`
   - `ADZUNA_APP_KEY`
3. Configurar en Render el microservicio Spring Boot con:
   - `ANALYTICS_DATASOURCE_URL`
   - `ANALYTICS_DATASOURCE_USERNAME`
   - `ANALYTICS_DATASOURCE_PASSWORD`
   - `PORT`
4. Desplegar el frontend React en Vercel usando la carpeta `frontend`
5. Configurar en Vercel:
   - `VITE_API_URL`
6. Verificar que NestJS acepta el origen real del frontend mediante `FRONTEND_URL`
7. Verificar que Prisma aplica migraciones al arrancar el backend
8. Probar el flujo completo:
   - register
   - login
   - dashboard
   - filtros
   - analytics
   - sockets

## CI

El proyecto incluye pipeline de GitHub Actions para:

- instalar dependencias del backend
- ejecutar tests de NestJS
- compilar el backend
- ejecutar tests de Spring Boot
- compilar y testear el frontend
- validar la integración básica de las tres capas

## Próximos pasos

- mejorar observabilidad y logging del backend
- refinar UX del dashboard
- ampliar test coverage end-to-end
- enriquecer la visualización de analytics
- endurecer manejo de errores y estados vacíos

## Autor

Proyecto desarrollado por Jaime Tarín como pieza de portfolio para practicar y demostrar:

- NestJS
- React
- Prisma
- Spring Boot
- PostgreSQL
- JWT
- WebSockets
- testing
- CI/CD
- despliegue full-stack