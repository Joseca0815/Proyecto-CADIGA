# Gestor de Infraestructura Web para Desarrollo

##  Integrantes del Equipo
* **Juan Carlos Diaz Eguizs** - [eguizs](https://github.com/eguizs)
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
