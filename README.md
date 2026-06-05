# Gestor de Infraestructura Web para Desarrollo

##  Integrantes del Equipo
* **Juan Carlos Diaz Eguis** - [eguizs](https://github.com/eguizs)
* **Jose Angel Galaz Lagarda** - [joseGL1000](https://github.com/joseGL1000)
* **Jose Mario Carrillo Campas** - [Joseca0815](https://github.com/Joseca0815)

---

##  Descripción del Proyecto
Este proyecto consiste en un **Gestor de Infraestructura Web** mínimo diseñado para la administración y control de usuarios dentro de un entorno de desarrollo. La aplicación implementa un ciclo de vida de desarrollo de software (SDLC) estructurado, un flujo de trabajo colaborativo basado en Git/GitHub, y la separación estricta entre la interfaz de usuario y la lógica de negocio.

---

##  Stack Tecnológico

### Backend (API REST)
* **Entorno de Ejecución:** Node.js
* **Framework:** Express.js
* **Autenticación:** JSON Web Tokens (JWT)
* **Seguridad:** Bcrypt (Hash de contraseñas) y Middlewares de validación

### Frontend (Cliente)
* **Lenguajes:** HTML5, CSS3 y JavaScript Vanilla
* **Estructura:** Consumo asíncrono de API mediante Fetch API

### Base de Datos y Herramientas
* **Motor de Base de Datos:** MySQL
* **Gestión del Proyecto:** GitHub Projects (Tablero Kanban)
* **Pruebas de Software:** Postman (Pruebas Manuales)

---

##  Guía de Instalación y Despliegue de la Infraestructura

Siga rigurosamente los siguientes pasos para clonar, configurar y ejecutar la aplicación en su entorno local:

### 1. Clonar el Repositorio
Abra una terminal en su sistema operativo, posiciónese en su directorio de trabajo y descargue el código fuente del repositorio ejecutando:
git clone https://github.com/Joseca0815/Proyecto-CADIGA.git
cd Proyecto-CADIGA

### 2. Instalación de Dependencias del Servidor
Instale los módulos de Node.js requeridos por el backend ejecutando el gestor de paquetes de NPM:
npm install

### 3. Configuración del Entorno (.env)
Para resguardar las credenciales de acceso y mantener las buenas prácticas de seguridad, cree un archivo llamado .env en la raíz del proyecto. Utilice la siguiente estructura configurando sus datos locales de MySQL:
PORT=3000
DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=infraestructura_db
JWT_SECRET=clave_secreta_para_firmar_tokens_jwt

### 4. Inicialización de la Base de Datos
Asegúrese de tener el servicio de MySQL activo. Acceda a su gestor de bases de datos y cree el esquema con el nombre asignado en su entorno:
CREATE DATABASE infraestructura_db;

### 5. Ejecución del Servidor de Desarrollo
Para levantar el backend y dejar la infraestructura web operando localmente, ejecute el comando de inicio:
npm start

Nota: Tras iniciar el servidor, la consola indicará que se encuentra escuchando en el puerto configurado (http://localhost:3000) y que la conexión con MySQL se ha establecido de manera exitosa. Podrá interactuar con el sistema a través del navegador o Postman.

---

##  Arquitectura y Buenas Prácticas de Desarrollo Obligatorias

Para dar cumplimiento a los lineamientos arquitectónicos solicitados en la evaluación, el desarrollo se rige bajo los siguientes principios fundamentales:

* **Separación Frontend/Backend:** El backend se comporta como una API REST pura que procesa solicitudes HTTP y devuelve únicamente objetos en formato JSON, aislando por completo la lógica del negocio de la capa de presentación.
* **Skinny Controllers / Fat Models:** Los controladores de Express mantienen una estructura limpia y delgada, limitándose a recibir y responder las peticiones HTTP (req, res). Las validaciones complejas de datos, operaciones criptográficas e interacciones con la base de datos corresponden a los modelos.
* **Uso de Validators:** Se implementan capas intermedias (Middlewares) encargadas de validar estructuralmente los datos de entrada (como formato estricto de correo electrónico y longitudes de contraseña) antes de permitir el acceso a las funciones del controlador.
* **Historial de Commits Descriptivos:** El control de versiones sigue convenciones estandarizadas para mantener la trazabilidad y legibilidad en el repositorio de trabajo colaborativo.



Documentación y pruebas
# API REST de Usuarios - Infraestructura Multicontenedor y Control de Acceso Seguro

Este repositorio contiene la arquitectura de servicios unificada para el sistema de gestión de usuarios, integrando una API REST construida en **Node.js (Express)** y un motor de base de datos relacional **MySQL**, orquestados de manera automatizada mediante contenedores independientes con Docker.

---

## 1. Características de Seguridad Implementadas

Para cumplir con los estándares criptográficos requeridos, el sistema cuenta con dos capas esenciales de protección:
* **Cifrado de Credenciales:** Las contraseñas se procesan en el Backend utilizando la librería `bcryptjs`, aplicando un algoritmo de hashing criptográfico unidireccional (Salts + Hash) antes de ingresar cualquier registro a la base de datos de manera persistente.
* **Control de Acceso (JWT):** Las rutas críticas del CRUD y de consulta general están protegidas mediante un middleware de autenticación que intercepta las solicitudes y exige la validación de firmas digitales utilizando **JSON Web Tokens (JWT)**.

---

## 2. Requisitos Previos y Variables de Entorno

Antes de inicializar la infraestructura, asegúrese de contar con:
* **Docker Desktop** instalado (para entornos locales) o un espacio de trabajo activo en **GitHub Codespaces**.
* Un archivo `.env` configurado en la raíz del proyecto con las siguientes variables de entorno:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=secret_password
DB_NAME=infraestructura_db
JWT_SECRET=tu_clave_secreta_super_segura

***Manual de Inicialización y Despliegue Único***
Para compilar las dependencias del servidor, levantar los servicios en paralelo y asegurar un entorno limpio de residuos anteriores, ejecute los siguientes comandos en la terminal raíz:

Detener y limpiar contenedores huérfanos previos:

Bash
docker compose down
Construir imágenes personalizadas desde cero y encender la arquitectura:

Bash
docker compose up --build

***Estructuración de la Base de Datos (MySQL)***
Al inicializar los contenedores por primera vez, conéctese al puerto local 3306 utilizando su cliente SQL preferido (ej. la extensión MySQL Database Client en VS Code) e introduzca el siguiente script para dar de alta la tabla de registros protegidos:

SQL
USE infraestructura_db;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

# Suite de Pruebas Interactivas y Respuestas del Servidor (pruebas.http)

Utilice la extensión **REST Client** de VS Code sobre este archivo estructurado para ejecutar las pruebas funcionales en el orden estricto indicado. A la derecha de cada petición se incluye el formato del JSON que responderá el servidor.

## 1. EVIDENCIA 5.A: INTENTAR ACCEDER A LA RUTA PROTEGIDA SIN TOKEN

**[READ GENERAL]** Esta petición debe ser rechazada por el middleware de seguridad.

### HTTP

```http
GET https://crispy-barnacle-4j96vx6wj452q6vp-3000.app.github.dev/usuarios
```

### Respuesta esperada del servidor (JSON de error)

```json
{
  "error": "Acceso denegado",
  "detalles": "Falta el token de autorización en los encabezados."
}
```

## 2. [CREATE] REGISTRAR UN USUARIO NUEVO (Encriptación con Bcrypt)

Manda la contraseña en texto plano; el backend la hashea antes de ingresarla a MySQL.

### HTTP

```http
POST https://crispy-barnacle-4j96vx6wj452q6vp-3000.app.github.dev/usuarios
Content-Type: application/json

{
    "nombre": "Juan_Secret",
    "correo": "seto@ejemplo.com",
    "password": "mipassword_seguro"
}
```

### Respuesta esperada del servidor (JSON de éxito)

```json
{
  "id": 1,
  "nombre": "Juan_Secret",
  "correo": "seto@ejemplo.com",
  "created_at": "2026-06-05T07:48:41.000Z"
}
```

## 3. LOGIN EN EL BACKEND (Generación de Firma JWT Legítima)

El backend validará los hashes y generará el token de acceso si las credenciales coinciden.

### HTTP

```http
POST https://crispy-barnacle-4j96vx6wj452q6vp-3000.app.github.dev/api/login
Content-Type: application/json

{
    "correo": "seto@ejemplo.com",
    "password": "mipassword_seguro"
}
```

### Respuesta esperada del servidor (JSON de éxito con token)

```json
{
  "mensaje": "Autenticación exitosa",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoic2V0b0BlamVtcGxvLmNvbSJ9..."
}
```

### Nota de error

Si introduce una estructura incorrecta o faltan campos, el servidor responderá:

```json
{
  "error": "Todos los campos son obligatorios"
}
```

## 4. EVIDENCIA 5.B: [READ AUTORIZADO] ACCESO CON TOKEN JWT

Reemplace el marcador de posición por el token generado en el paso anterior.

### HTTP

```http
GET https://crispy-barnacle-4j96vx6wj452q6vp-3000.app.github.dev/usuarios
Authorization: Bearer PEGAR_AQUÍ_EL_TOKEN_JWT
```

### Respuesta esperada del servidor (JSON con arreglo de usuarios)

```json
[
  {
    "id": 1,
    "nombre": "Juan_Secret",
    "correo": "seto@ejemplo.com",
    "created_at": "2026-06-05T07:48:41.000Z"
  }
]
```
## 5. [UPDATE] ACTUALIZAR UN USUARIO EXISTENTE (Parte del CRUD)

Cambie el número `/1` de la URL por el ID real que desea editar.

### HTTP

```http
PUT https://crispy-barnacle-4j96vx6wj452q6vp-3000.app.github.dev/usuarios/1
Content-Type: application/json

{
    "nombre": "Juan_Secret Editado",
    "correo": "seto_nuevo@ejemplo.com"
}
```

### Respuesta esperada del servidor (JSON de éxito)

```json
{
  "mensaje": "Usuario actualizado correctamente"
}

### Nota de error

Si introduce un ID inválido o inexistente en MySQL, responderá:

```json
{
  "error": "Usuario no encontrado"
}
```

## 6. [DELETE] ELIMINAR UN USUARIO POR ID (Cierre del CRUD)

Cambie el número `/1` del final por el ID real del registro que desea remover.

### HTTP

```http
DELETE https://crispy-barnacle-4j96vx6wj452q6vp-3000.app.github.dev/usuarios/1
```

### Respuesta esperada del servidor (JSON de éxito)

```json
{
  "mensaje": "Usuario eliminado correctamente de la base de datos"
}
```

# 4. Cierre del Segundo Pull Request (Parte 6)

Una vez guardada la documentación en la rama, ejecuten los últimos comandos en su consola para subir y cerrar la Parte 6:

```bash
git add README.md
git commit -m "docs: unificar manual completo de despliegue, comandos de docker, mysql, http y jsons de respuesta"
git push origin feature/issue-6-documentacion-despliegue
```
