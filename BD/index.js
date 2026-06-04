const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db'); // Importa el pool de conexiones que acabamos de crear

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ mensaje: "API de Infraestructura en Node.js activa en contenedor" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor Express corriendo en el puerto ${PORT}`);
});