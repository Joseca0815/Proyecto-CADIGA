const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Asegúrate de que esté instalado
require('dotenv').config();

// Extraemos directamente 'pool' del archivo db
const { pool } = require('./db'); 

const app = express();
app.use(cors());
app.use(express.json());

// Clave secreta para firmar los tokens JWT
const JWT_SECRET = process.env.JWT_SECRET || 'mi_firma_secreta_super_segura';

// ==========================================
// MIDDLEWARE DE PROTECCIÓN (Causa el 401)
// ==========================================
function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Si no viene el token, bloqueamos con 401 Unauthorized
    if (!token) {
        return res.status(401).json({ 
            error: "No autorizado", 
            detalles: "Se requiere un token válido para acceder." 
        });
    }

    try {
        const verificado = jwt.verify(token, JWT_SECRET);
        req.usuario = verificado;
        next(); // Token correcto, continúa a la ruta
    } catch (error) {
        return res.status(401).json({ 
            error: "No autorizado", 
            detalles: "El token no es válido o ha expirado." 
        });
    }
}

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ mensaje: "API lista para el CRUD de usuarios con seguridad" });
});

// ==========================================
// ISSUE #3 Y EVIDENCIAS: REGISTRO Y LOGIN
// ==========================================

// 2. Crear un nuevo usuario (POST) - ¡AHORA SEGURO CON BCRYPTJS!
app.post('/usuarios', async (req, res) => {
    const { nombre, correo, password } = req.body;
    if (!nombre || !correo || !password) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }
    try {
        // Encriptamos la contraseña antes de guardarla en la Base de Datos
        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);

        const [result] = await pool.execute(
            'INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)',
            [nombre, correo, passwordEncriptada] // Guardamos la encriptada
        );
        res.status(201).json({ mensaje: "Usuario creado con éxito", id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar usuario", detalles: error.message });
    }
});

// NUEVO: Ruta de Login para que puedas obtener tu Token
app.post('/api/login', async (req, res) => {
    const { correo, password } = req.body;
    if (!correo || !password) {
        return res.status(400).json({ error: "Correo y contraseña requeridos" });
    }
    try {
        const [rows] = await pool.execute('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        if (rows.length === 0) {
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        const usuario = rows[0];
        // Comparamos la contraseña usando bcryptjs
        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        // Generamos el token JWT
        const token = jwt.sign({ id: usuario.id, correo: usuario.correo }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ mensaje: "Login exitoso", token });
    } catch (error) {
        res.status(500).json({ error: "Error en el login", detalles: error.message });
    }
});

// ==========================================
// RUTAS PROTEGIDAS (Agregamos el middleware 'verificarToken')
// ==========================================

// 1. Obtener todos los usuarios (GET) -> AFECTA A TU EVIDENCIA 5.A y 5.B
app.get('/usuarios', verificarToken, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, nombre, correo, created_at FROM usuarios');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener usuarios", detalles: error.message });
    }
});

// 3. Actualizar un usuario (PUT) - Protegido
app.put('/usuarios/:id', verificarToken, async (req, res) => {
    const { id } = req.params;
    const { nombre, correo } = req.body;
    try {
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

// 4. Eliminar un usuario (DELETE) - Protegido
app.delete('/usuarios/:id', verificarToken, async (req, res) => {
    const { id } = req.params;
    try {
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
