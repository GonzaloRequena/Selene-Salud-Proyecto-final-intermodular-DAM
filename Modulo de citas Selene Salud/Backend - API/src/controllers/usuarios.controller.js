const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Número de rondas de encriptación para bcrypt (estándar seguro)
const SALT_ROUNDS = 10;

/**
 * 1. REGISTRO DE USUARIOS
 * POST /api/usuarios/registro
 */
const registro = async (req, res) => {
    const { dni_nie, nombre, apellidos, email, password, telefono, rol } = req.body;

    // Validación básica de campos obligatorios según tu diseño de tabla
    if (!dni_nie || !nombre || !apellidos || !email || !password || !rol) {
        return res.status(400).json({ error: "Faltan campos obligatorios para el registro" });
    }

    try {
        // Encriptar la contraseña antes de guardarla
        const passwordEncriptada = await bcrypt.hash(password, SALT_ROUNDS);

        // Insertar en la base de datos de Neon
        const sql = `
            INSERT INTO usuarios (dni_nie, nombre, apellidos, email, password, telefono, rol)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, dni_nie, nombre, apellidos, email, telefono, rol;
        `;
        const valores = [dni_nie, nombre, apellidos, email, passwordEncriptada, telefono, rol];

        const resultado = await db.query(sql, valores);
        const usuarioCreado = resultado.rows[0];

        res.status(201).json({
            mensaje: "Usuario registrado con éxito",
            usuario: usuarioCreado
        });

    } catch (error) {
        console.error("Error en registro:", error);
        
        // Manejo amigable de errores por duplicado (DNI o Email ya existentes)
        if (error.code === "23505") {
            return res.status(409).json({ error: "El Email o el DNI ya están registrados en el sistema" });
        }
        
        res.status(500).json({ error: "Error interno del servidor al registrar el usuario" });
    }
};

/**
 * 2. LOGIN DE USUARIOS
 * POST /api/usuarios/login
 */
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email y contraseña son requeridos" });
    }

    try {
        // Buscar al usuario por email
        const sql = "SELECT * FROM usuarios WHERE email = $1";
        const resultado = await db.query(sql, [email]);

        if (resultado.rows.length === 0) {
            return res.status(401).json({ error: "Credenciales incorrectas (Email no encontrado)" });
        }

        const usuario = resultado.rows[0];

        // Comparar la contraseña introducida con el hash de la base de datos
        const passwordCorrecta = await bcrypt.compare(password, usuario.password);

        if (!passwordCorrecta) {
            return res.status(401).json({ error: "Credenciales incorrectas (Contraseña falsa)" });
        }

        // Generar el Token JWT (expira en 4 horas)
        const payload = {
            id: usuario.id,
            email: usuario.email,
            rol: usuario.rol
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: "4h" });

        // Devolver la información del usuario (excluyendo el password por seguridad) y el token
        res.json({
            mensaje: "Login correcto",
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellidos: usuario.apellidos,
                email: usuario.email,
                rol: usuario.rol
            }
        });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ error: "Error interno del servidor al iniciar sesión" });
    }
};

/**
 * OBTENER TODOS LOS MÉDICOS (Para desplegables del Administrador)
 * GET /api/usuarios/medicos
 * Protegido: ADMIN
 */
const obtenerMedicos = async (req, res) => {
    try {
        const sql = `
            SELECT id, dni_nie, nombre, apellidos, email, telefono 
            FROM usuarios 
            WHERE rol = 'MEDICO'
            ORDER BY apellidos ASC, nombre ASC;
        `;
        const resultado = await db.query(sql);

        res.json({
            total: resultado.rows.length,
            medicos: resultado.rows
        });
    } catch (error) {
        console.error("Error al listar médicos:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener el personal médico" });
    }
};

module.exports = {
    registro,
    login,
    obtenerMedicos
};