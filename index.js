const express = require('express');
const mysql = require('mysql2/promise'); // Usamos versión promesa para el async/await
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ mensaje: "API de Infraestructura en Node.js activa en contenedor" });
});

const PORT = process.env.PORT || 3000;

// Función inteligente de conexión con reintentos automáticos
async function conectarDB() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || "db-mysql",
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASSWORD || "secret_password",
            database: process.env.DB_NAME || "infraestructura_db"
        });

        console.log("✅ Conectado a MySQL con éxito en el contenedor.");
        
        // Una vez conectados con éxito, levantamos el servidor Express
        app.listen(PORT, () => {
            console.log(`🚀 Servidor Express corriendo en el puerto ${PORT}`);
        });

    } catch (error) {
        console.log("❌ Base de datos no lista. Esperando MySQL...");
        // Si falla (porque MySQL está iniciando o por credenciales), reintenta en 5 segundos
        setTimeout(conectarDB, 5000);
    }
}

// Inicializar el bucle de conexión
conectarDB();

conectarDB();