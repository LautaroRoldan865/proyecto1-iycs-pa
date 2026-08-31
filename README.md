# Proyecto 1 - Ingeniería y Calidad de Software - Programación Avanzada

Sistema de gestión web full-stack para una distribuidora: administración de productos, clientes, proveedores, personal y usuarios, con generación de documentos (PDF / Excel) y OCR.

Proyecto académico de la materia **Ingeniería y Calidad de Software | Programación Avanzada**.

🔗 **Demo:** https://proyecto1-iycs-pa.vercel.app

---
## Integrantes

| **Estudiantes** | **Nro. Legajo** | **Correo Electrónico** |
|-----------------|-----------------|------------------------|
| ***Maggi,*** *Mateo David* | 16294 | [*mateomaggi123@gmail.com*](mailto:mateomaggi123@gmail.com) |
| ***Pereyra Argüello,*** *Milagros* | 15661 | [*mpereyraarguello@gmail.com*](mailto:mpereyraarguello@gmail.com) |
| ***Petry,*** *Victoria* | 15664 | [*victoriapetry07@gmail.com*](mailto:victoriapetry07@gmail.com) |
| ***Roldán,*** *Lautaro* | 15726 | [*roldanlautaro427@gmail.com*](mailto:roldanlautaro427@gmail.com) |
| ***Urzagaste,*** *Karen* | 16303 | [*karenurzagaste100@gmail.com*](mailto:karenurzagaste100@gmail.com) |
| ***Zandrino,*** *Felipe* | 16267 | [*felipezandrino80.2@gmail.com*](mailto:felipezandrino80.2@gmail.com) |

---

## Tabla de contenidos

- [Arquitectura](#arquitectura)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Requisitos previos](#requisitos-previos)
- [Puesta en marcha](#puesta-en-marcha)
  - [1. Base de datos (TiDB)](#1-base-de-datos)
  - [2. Backend](#2-backend)
  - [3. Frontend](#3-frontend)
- [Variables de entorno](#variables-de-entorno)
- [Módulos del backend](#módulos-del-backend)
- [Documentación de la API](#documentación-de-la-api)

---

## Arquitectura

Aplicación cliente-servidor dividida en dos proyectos independientes:

```
Navegador ──► Frontend (React + Vite)  ──HTTP/REST──►  Backend (NestJS)  ──►  MySQL 8
```

- El **frontend** consume la API REST del backend vía Axios.
- El **backend** expone endpoints bajo el prefijo `/api`, persiste con TypeORM sobre MySQL y genera documentos (PDFKit / pdfmake / xlsx) y OCR (Tesseract.js).
- Autenticación con **JWT** y login social (Google / Facebook).

---

## Stack tecnológico

### Backend — `Proyecto1_Back/proyecto`

| Área | Tecnología |
|------|------------|
| Framework | NestJS 11 |
| Lenguaje | TypeScript 5 |
| ORM / DB | TypeORM 0.3 + MySQL 8 (`mysql2`) |
| Auth | `@nestjs/jwt`, `bcrypt`, `google-auth-library` |
| Validación | `class-validator`, `class-transformer` |
| Documentos | `pdfkit`, `pdfmake`, `xlsx`, `sharp` |
| OCR | `tesseract.js` (idiomas `spa`, `eng`) |
| Mail | `nodemailer` + `handlebars` |
| Integraciones | `soap`, `xml2js`, `node-forge` |
| Docs API | `@nestjs/swagger` |
| Testing | Jest + Supertest |

### Frontend — `Proyecto1_Front`

| Área | Tecnología |
|------|------------|
| Framework | React 19 + Vite 6 |
| Lenguaje | TypeScript 5 |
| Routing | React Router DOM 7 |
| Estado | Jotai |
| Estilos | Tailwind CSS 3 + shadcn/ui + Radix UI |
| Formularios | React Hook Form + Yup |
| Tablas / gráficos | AG Grid, Recharts |
| HTTP | Axios |
| Auth social | `@react-oauth/google`, `@greatsumini/react-facebook-login` |
| Deploy | Vercel / Render |

---

## Estructura del repositorio

```
proyecto1-iycs-pa/
├── Proyecto1_Back/
│   └── proyecto/
│       ├── src/
│       │   ├── modules/            # Módulos de dominio (ver más abajo)
│       │   ├── migrations/         # Migraciones TypeORM
│       │   ├── app.module.ts
│       │   └── main.ts             # Bootstrap: CORS, prefijo /api, Swagger, ValidationPipe
│       ├── tessdata/               # Modelos OCR (spa/eng)
│       ├── uploads/                # Archivos subidos
│       ├── orm.config.ts           # DataSource para el CLI de TypeORM
│       ├── docker-compose.yml      # MySQL 8 + phpMyAdmin
│       ├── Dockerfile
│       └── package.json
│
└── Proyecto1_Front/
    ├── src/
    │   ├── pages/                  # home, login, dashboard-home, administracion
    │   ├── componentes/            # Componentes reutilizables
    │   ├── context/                # Estado global / auth
    │   ├── hooks/                  # Custom hooks
    │   ├── interfaces/             # Tipos TypeScript
    │   ├── config/                 # Configuración (URL de la API)
    │   ├── utils/
    │   ├── App.tsx
    │   └── main.tsx
    ├── vite.config.ts
    ├── vercel.json
    ├── Dockerfile
    └── package.json
```

---

## Requisitos previos

- **Node.js** 20+ y **yarn** (el frontend usa yarn; el backend incluye `yarn.lock` y `package-lock.json`, cualquiera sirve)
- **MySQL 8** ya que el grupo optó por no utilizar Docker.

---

## Puesta en marcha

Cloná el repositorio:

```bash
git clone https://github.com/mpereyraarguello/proyecto1-iycs-pa.git
cd proyecto1-iycs-pa
```

### 1. Base de datos (TiDB)
Se utilizó para la persistencia de los datos TiDB.

### 2. Backend

```bash
cd Proyecto1_Back/proyecto
yarn install
cp .env-temp .env        # completá los valores (ver tabla de variables)
yarn migration:run    # aplica las migraciones de TypeORM
yarn start:dev
```

### 3. Frontend

```bash
cd Proyecto1_Front
yarn install
yarn start:dev
```
---

## Variables de entorno

### Backend (`Proyecto1_Back/proyecto/.env`)

A partir de `.env-temp`:

| Variable | Descripción |
|----------|-------------|
| `DB_PORT` | Puerto de la base de datos |
| `DB_HOST` | Host de la base de datos |
| `DB_USERNAME` | Usuario de la base de datos |
| `DB_PASSWORD` | Contraseña de la base de datos |
| `DB_DATABASE` | Nombre de la base de datos |
| `PORT` | Puerto en el que se ejecuta la aplicación |
| `DB_TYPE` | Tipo de base de datos |
| `DB_SSL` | Indica si la conexión SSL está habilitada |
| `JWT_SECRET` | Clave secreta utilizada para firmar los tokens JWT |
| `JWT_EXPIRATION_ACCESS` | Tiempo de expiración del token de acceso |
| `JWT_EXPIRATION_REFRESH` | Tiempo de expiración del token de actualización |
| `PUNTO_VENTA_ACTIVO_ID` | Identificador del punto de venta activo |

---

## Módulos del backend

Ubicados en `src/modules/`:

| Grupo | Módulo | Responsabilidad |
|-------|--------|-----------------|
| **Gestión de usuario** | `auth` | Login, JWT, OAuth Google/Facebook |
| | `usuario` | ABM de usuarios |
| | `rol` | Roles y permisos |
| **Gestión de productos** | `marca` | Marcas |
| | `linea` | Líneas / familias de producto |
| | `producto` | Productos y operaciones asociadas |
| **Organización** | `cliente` | Clientes y sus operaciones |
| | `proveedor` | Proveedores y sus operaciones |
| | `personal` | Personal / empleados |
| | `empresa` | Datos y operaciones de la empresa |
| **Utilidades (`gutil`)** | `domicilio`, `localidad`, `provincia` | Datos geográficos |
| | `condicion-iva` | Condiciones frente al IVA |
| **Gestión del sistema** | `configuracion-sistema` | Parámetros del sistema |
| | `busquedas` | Búsquedas generales |
| **Gestión de documentos** | | Generación de PDF/Excel y OCR |
| **Common** | `files` | Carga y manejo de archivos |
| **Seeds** | `seed-*` | Carga de datos iniciales (familias de producto, organización, usuarios, all) |

---

## Documentación de la API

Con el backend corriendo, la documentación **Swagger** ("Gestión Base - Distribuidora", v1.0) se genera mediante `@nestjs/swagger` y queda expuesta por `SwaggerModule.setup` en `main.ts`. Verificá la ruta exacta en ese archivo (habitualmente `http://localhost:3000/api`).

---

## Notas

- `synchronize` está **desactivado** en TypeORM: los cambios de esquema se aplican solo por migraciones.
- Zona horaria del backend fijada en UTC-3; conexión a MySQL con SSL (`rejectUnauthorized: true`).
- Límite de payload de la API: 50 MB (JSON y urlencoded).


