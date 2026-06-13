const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { pool } = require('./db'); 

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'mi_firma_secreta_super_segura';

// ==========================================
// MIDDLEWARE DE PROTECCIÓN (Solo para el apartado 5)
// ==========================================
function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            error: "No autorizado", 
            detalles: "Se requiere un token válido para acceder." 
        });
    }

    try {
        const verificado = jwt.verify(token, JWT_SECRET);
        req.usuario = verificado;
        next(); 
    } catch (error) {
        return res.status(401).json({ 
            error: "No autorizado", 
            detalles: "El token no es válido o ha expirado." 
        });
    }
}

// ==========================================================
// RUTA DE PRUEBA E INICIO
// ==========================================================
app.get('/', (req, res) => {
    res.json({ mensaje: "API lista para el CRUD de usuarios con seguridad híbrida" });
});



// Ruta para servir la interfaz visual del Login
app.get('/login-vista', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});


// ==========================================================
// APARTADOS 1, 2, 3, 4: CRUD TOTALMENTE PÚBLICO (SIN SEGURIDAD)
// ==========================================================

// 1. Obtener todos los usuarios (GET) - LIBRE
app.get('/usuarios', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, nombre, correo, created_at FROM usuarios');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener usuarios", detalles: error.message });
    }
});

// 2. Crear un nuevo usuario (POST) - LIBRE (Guarda la contraseña tal cual la mandas)
app.post('/usuarios', async (req, res) => {
    const { nombre, correo, password } = req.body;
    if (!nombre || !correo || !password) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }
    try {
        const [result] = await pool.execute(
            'INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)',
            [nombre, correo, password]
        );
        res.status(201).json({ mensaje: "Usuario creado con éxito (Modo Público)", id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar usuario", detalles: error.message });
    }
});

// 3. Actualizar un usuario (PUT) - LIBRE
app.put('/usuarios/:id', async (req, res) => {
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

// 4. Eliminar un usuario (DELETE) - LIBRE
app.delete('/usuarios/:id', async (req, res) => {
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

// ==========================================================
// APARTADO 5: SEGURIDAD (BCRYPT, LOGIN Y RUTAS PROTEGIDAS)
// ==========================================================

// 5.1 Registro Seguro (POST /api/secure-register) -> Usa Bcrypt
app.post('/api/secure-register', async (req, res) => {
    const { nombre, correo, password } = req.body;
    if (!nombre || !correo || !password) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);

        const [result] = await pool.execute(
            'INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)',
            [nombre, correo, passwordEncriptada]
        );
        res.status(201).json({ mensaje: "Usuario registrado de manera segura con Bcrypt", id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: "Error en el registro seguro", detalles: error.message });
    }
});


app.post('/api/login', async (req, res) => {
    const { correo, password } = req.body;
    // Captura la IP de quien intenta loguearse
    const ipCliente = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

    if (!correo || !password) {
        return res.status(400).json({ error: "Correo y contraseña requeridos" });
    }

    try {
        const [rows] = await pool.execute('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        
        // 🚨 CASO 1: El usuario no existe en la base de datos
        if (rows.length === 0) {
            await pool.execute('INSERT INTO logs_acceso (correo, accion, resultado, ip) VALUES (?, ?, ?, ?)', 
                [correo, 'login', 'FALLIDO', ipCliente]);

            return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        const usuario = rows[0];

        // 1. PRIMER INTENTO: Verificamos si la contraseña coincide tal cual (Texto Plano)
        let passwordValida = (password === usuario.password);

        // 2. SEGUNDO INTENTO: Si no coincidió en texto plano, intentamos con Bcrypt
        if (!passwordValida) {
            try {
                passwordValida = await bcrypt.compare(password, usuario.password);
            } catch (bcryptError) {
                passwordValida = false;
            }
        }

        // 🚨 CASO 2: La contraseña no fue válida (Login Fallido)
        if (!passwordValida) {
            await pool.execute('INSERT INTO logs_acceso (correo, accion, resultado, ip) VALUES (?, ?, ?, ?)', 
                [correo, 'login', 'FALLIDO', ipCliente]);

            return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        // 🟢 CASO 3: Todo salió bien (Login Exitoso)
        await pool.execute('INSERT INTO logs_acceso (correo, accion, resultado, ip) VALUES (?, ?, ?, ?)', 
            [correo, 'login', 'EXITOSO', ipCliente]);

        // Aquí puedes generar tu JWT o respuesta de éxito normal
        res.json({ mensaje: "¡Inicio de sesión correcto!", usuario: { nombre: usuario.nombre, correo: usuario.correo } });

    } catch (error) {
        res.status(500).json({ error: "Error en el servidor", detalles: error.message });
    }
});

// 5.3 EVIDENCIAS A Y B: Ruta exclusiva con bloqueo JWT obligado
app.get('/api/usuarios-protegidos', verificarToken, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, nombre, correo FROM usuarios');
        res.json({
            mensaje: "Acceso autorizado con Token exitoso (Evidencia 5.B)",
            usuarios: rows
        });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener usuarios protegidos", detalles: error.message });
    }
});

// =================================================================
// ENDPOINTS PARA LA API REST DE LOGS DE ACCESO 
// =================================================================

// GET /api/logs -> Consultar todos los logs
app.get('/api/logs', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM logs_acceso ORDER BY fecha DESC');
        res.json({ mensaje: "Historial de logs obtenido con éxito", logs: rows });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los logs", detalles: error.message });
    }
});

// POST /api/logs -> Insertar un log manualmente
app.post('/api/logs', async (req, res) => {
    const { correo, accion, resultado } = req.body;
    if (!correo || !accion || !resultado) {
        return res.status(400).json({ error: "Faltan campos obligatorios (correo, accion, resultado)" });
    }
    
    // Captura la IP de quien hace la petición
    const ipCliente = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    
    try {
        await pool.execute('INSERT INTO logs_acceso (correo, accion, resultado, ip) VALUES (?, ?, ?, ?)', 
            [correo, accion, resultado, ipCliente]);
        res.status(201).json({ mensaje: "Log registrado de manera exitosa" });
    } catch (error) {
        res.status(500).json({ error: "Error al insertar el log", detalles: error.message });
    }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});


app.post('/api/logout', async (req, res) => {
    const { correo } = req.body; // El frontend debería enviar el correo del usuario que cierra sesión
    const ipCliente = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

    try {
        if (correo) {
            // 🟢 GUARDAR LOG DE LOGOUT
            await pool.execute(
                'INSERT INTO logs_acceso (correo, accion, resultado, ip) VALUES (?, ?, ?, ?)', 
                [correo, 'logout', 'EXITOSO', ipCliente]
            );
        }
        res.json({ mensaje: "Sesión cerrada correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar salida", detalles: error.message });
    }
});