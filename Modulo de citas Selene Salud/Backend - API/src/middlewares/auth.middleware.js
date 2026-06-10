/***********************************************************************
 * MIDDLEWARE DE AUTENTICACIÓN Y CONTROL DE ROLES (JWT)
 ***********************************************************************/
const jwt = require("jsonwebtoken");

/**
 * 1. Verificador del Token JWT
 * Comprueba que el usuario está logueado y su token es válido.
 */
const verificarToken = (req, res, next) => {
    // Capturar el token de la cabecera 'Authorization' (Formato: Bearer TOKEN)
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(403).json({ error: "Acceso denegado. No se proporcionó un token de autenticación." });
    }

    try {
        // Verificar y decodificar el token con nuestra clave secreta
        const decodificado = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        
        // Inyectamos los datos del usuario logueado en el objeto 'req' (petición)
        // para que los siguientes controladores sepan QUIÉN está operando.
        req.usuarioLogueado = decodificado; 
        
        // Damos paso al siguiente eslabón (controlador o siguiente middleware)
        next(); 
    } catch (error) {
        return res.status(401).json({ error: "Token inválido o caducado. Inicie sesión de nuevo." });
    }
};

/**
 * 2. Limitador de Roles (Autorización)
 * Recibe los roles permitidos y verifica si el usuario logueado tiene uno de ellos.
 */
const permitirRoles = (...rolesPermitidos) => {
    return (req, res, next) => {
        // Asegurarse de que el middleware de verificarToken se ejecutó antes
        if (!req.usuarioLogueado) {
            return res.status(500).json({ error: "Error de configuración en el servidor (Falta verificarToken)" });
        }

        const { rol } = req.usuarioLogueado;

        // Comprobar si el rol del usuario está en la lista de permitidos
        if (!rolesPermitidos.includes(rol)) {
            return res.status(403).json({ error: `Acceso prohibido. Tu rol (${rol}) no tiene permisos para esta acción.` });
        }

        // Si tiene el rol adecuado, continúa
        next();
    };
};

module.exports = {
    verificarToken,
    permitirRoles
};