# Pure Life

Sistema integral para la gestión de planes nutricionales y menús, diseñado para nutriólogos y usuarios.

## Descripción

Pure Life es una aplicación web que permite a los nutriólogos gestionar menús, perfiles de usuarios y planes semanales. Los usuarios pueden visualizar sus planes, calcular sus necesidades calóricas y diseñar sus propios menús basados en recomendaciones.

## Instrucciones de Instalación y Ejecución

Sigue estos pasos para ejecutar el proyecto en tu entorno local.

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd pure-life
```

### 2. Configuración del Backend (Laravel)

```bash
cd backend

# Instalar dependencias de PHP
composer install

# Configurar el archivo de entorno
cp .env.example .env
# IMPORTANTE: Abre el archivo .env y configura tus credenciales de base de datos (DB_DATABASE, DB_USERNAME, DB_PASSWORD)

# Generar la clave de la aplicación
php artisan key:generate

# Ejecutar migraciones y seeders (datos de prueba)
php artisan migrate --seed

# Iniciar el servidor de desarrollo
php artisan serve
```

### 3. Configuración del Frontend (Angular)

En una nueva terminal:

```bash
cd frontend

# Instalar dependencias de Node.js
npm install

# Iniciar el servidor de desarrollo
ng serve
```

La aplicación estará disponible en `http://localhost:4200`.

## Credenciales de Prueba

Una vez ejecutados los seeders, puedes acceder con el siguiente usuario administrador:

*   **Correo:** `admin@purelife.com`
*   **Contraseña:** `password`

### Usuarios de Prueba Adicionales

*   **Nutriólogo:** `nutriologo@purelife.com` / `password`
*   **Usuario 1:** `usuario1@purelife.com` / `password`
*   **Usuario 2:** `usuario2@purelife.com` / `password`
