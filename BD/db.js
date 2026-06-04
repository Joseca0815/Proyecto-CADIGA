const mysql = require('mysql2/promise');
require('dotenv').config();

// Crear el pool de conexiones usando variables de entorno
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'db-mysql',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'secret_password',
    database: process.env.DB_NAME || 'infraestructura_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Función para verificar la conexión inicial al pool
async function verificarConexion() {
    try {
        const connection = await pool.getConnection();
        console.log("✅ [Pool MySQL] Conexión exitosa y segura al contenedor de la Base de Datos.");
        connection.release(); // Liberar la conexión de vuelta al pool
    } catch (error) {
        console.error("❌ [Pool MySQL] Error al conectar con el contenedor de la base de datos:", error.message);
    }
}

verificarConexion();

module.exports = pool;