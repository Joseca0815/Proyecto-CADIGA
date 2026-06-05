const express = require('express');
const cors = require('cors');
require('dotenv').config();

// DESESTRUCTURACIÓN: Extraemos directamente 'pool' del archivo db
const { pool } = require('./db.js');
const app = express();
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ mensaje: "API lista para el CRUD de usuarios" });
});

// ==========================================
// ISSUE #3: CREAR Y CONSULTAR USUARIOS
// ==========================================

// 1. Obtener todos los usuarios (GET)
app.get('/usuarios', async (req, res) => {
    try {
        // Corregido a pool.query
        const [rows] = await pool.query('SELECT id, nombre, correo, created_at FROM usuarios');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener usuarios", detalles: error.message });
    }
});

// 2. Crear un nuevo usuario (POST)
app.post('/usuarios', async (req, res) => {
    const { nombre, correo, password } = req.body;
    if (!nombre || !correo || !password) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }
    try {
        // Corregido a pool.execute
        const [result] = await pool.execute(
            'INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)',
            [nombre, correo, password]
        );
        res.status(201).json({ mensaje: "Usuario creado con éxito", id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar usuario", detalles: error.message });
    }
});

// ==========================================
// ISSUE #4: EDITAR Y ELIMINAR USUARIOS
// ==========================================

// 3. Actualizar un usuario (PUT)
app.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, correo } = req.body;
    try {
        // Corregido a pool.execute (más seguro para updates)
        const [result] = await pool.execute(
            'UPDATE usuarios SET nombre = ?, correo = ? WHERE id = ?',
            [nombre, correo, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json({ mensaje: "Usuario actualizado con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar usuario", detalles: error.message });
    }
});

// 4. Eliminar un usuario (DELETE)
app.delete('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Corregido a pool.execute
        const [result] = await pool.execute('DELETE FROM usuarios WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json({ mensaje: "Usuario eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar usuario", detalles: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});