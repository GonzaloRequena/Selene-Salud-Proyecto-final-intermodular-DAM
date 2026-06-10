/***********************************************************************
 * CONTROLADOR DE CENTROS DE SALUD
 ***********************************************************************/
const db = require("../config/db");

// Función para obtener todos los centros de salud de Neon
const obtenerCentros = async (req, res) => {
    try {
        // Ejecuta la consulta utilizando el pool configurado
        const resultado = await db.query("SELECT * FROM centros_salud ORDER BY id ASC");
        
        // Devuelve las filas obtenidas en formato JSON (status 200 por defecto)
        res.json(resultado.rows);
    } catch (error) {
        // En caso de error, lo saca por consola y avisa al cliente
        console.error("Error al obtener los centros de salud:", error);
        res.status(500).json({ 
            error: "Error interno del servidor al consultar los centros de salud" 
        });
    }
};

// Exportamos las funciones del controlador
module.exports = {
    obtenerCentros
};