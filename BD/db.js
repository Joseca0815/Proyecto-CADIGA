const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'db-mysql',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'secret_password',
    database: process.env.DB_NAME || 'infraestructura_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function verificarConexion(reintentos = 5) {
    try {
        const connection = await pool.getConnection();
        console.log("✅ [Pool MySQL] Conexión exitosa y segura al contenedor de la Base de Datos.");
        connection.release();
    } catch (error) {
        if (reintentos > 0) {
            console.log(`⏳ Base de datos inicializando... Reintentando conexión en 3 segundos (Intentos restantes: ${reintentos})`);
            setTimeout(() => verificarConexion(reintentos - 1), 3000);
        } else {
            console.error("❌ [Pool MySQL] Error definitivo al conectar con el contenedor:", error.message);
        }
    }
}
module.exports = { pool, verificarConexion };