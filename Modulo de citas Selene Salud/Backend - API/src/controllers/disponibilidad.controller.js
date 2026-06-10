const db = require("../config/db");

/**
 * 1. CREAR UNA NUEVA FRANJA DE DISPONIBILIDAD (Turno)
 * POST /api/disponibilidad
 * Protegido: MEDICO y ADMIN
 */
const crearDisponibilidad = async (req, res) => {
    // Extraemos los datos del cuerpo de la petición
    let { id_medico, id_centro, fecha, hora_inicio, hora_fin, duracion_minutos } = req.body;
    
    // Datos del usuario que tiene el token
    const usuarioLogueado = req.usuarioLogueado; 

    // DETALLE DE NOTA PARA EL TFG: Seguridad de Roles
    // Si el que está creando el turno es un MÉDICO, le obligamos a que el id_medico sea el SUYO propio.
    // Así evitamos maliciosamente que un médico cree turnos en nombre de otro compañero.
    if (usuarioLogueado.rol === "MEDICO") {
        id_medico = usuarioLogueado.id;
    } else if (usuarioLogueado.rol === "ADMIN" && !id_medico) {
        // Si es admin, tiene que especificar a qué médico le está asignando el turno
        return res.status(400).json({ error: "Como administrador, debes proporcionar el id_medico en el cuerpo." });
    }

    if (!id_centro || !fecha || !hora_inicio || !hora_fin) {
        return res.status(400).json({ error: "Faltan campos obligatorios (id_centro, fecha, hora_inicio, hora_fin)" });
    }

    try {
        // Validación de negocio extra: Verificar primero si ese médico realmente trabaja en ese centro
        const queryVinculo = "SELECT * FROM medicos_centros WHERE id_medico = $1 AND id_centro = $2";
        const resVinculo = await db.query(queryVinculo, [id_medico, id_centro]);

        if (resVinculo.rows.length === 0) {
            return res.status(400).json({ 
                error: "Operación denegada. Este médico no está vinculado formalmente a este centro de salud." 
            });
        }

        // Insertar el bloque de tiempo en la agenda
        const sql = `
            INSERT INTO disponibilidad_medica (id_medico, id_centro, fecha, hora_inicio, hora_fin, duracion_minutos)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const valores = [id_medico, id_centro, fecha, hora_inicio, hora_fin, duracion_minutos || 15];
        const resultado = await db.query(sql, valores);

        res.status(201).json({
            mensaje: "Turno de disponibilidad creado correctamente en la agenda",
            disponibilidad: resultado.rows[0]
        });

    } catch (error) {
        console.error("Error al crear disponibilidad:", error);
        res.status(500).json({ error: "Error interno del servidor al guardar la disponibilidad" });
    }
};

/**
 * 2. CONSULTAR DISPONIBILIDAD DE UN CENTRO (Para que el paciente elija)
 * GET /api/disponibilidad/centro/:id_centro
 * Público / Accesible por cualquier usuario logueado
 */
const obtenerDisponibilidadPorCentro = async (req, res) => {
    const { id_centro } = req.params;

    try {
        // Traemos los turnos del centro haciendo un JOIN con usuarios para saber el nombre del médico
        const sql = `
            SELECT d.*, u.nombre AS medico_nombre, u.apellidos AS medico_apellidos
            FROM disponibilidad_medica d
            JOIN usuarios u ON d.id_medico = u.id
            WHERE d.id_centro = $1 AND d.fecha >= CURRENT_DATE
            ORDER BY d.fecha ASC, d.hora_inicio ASC;
        `;
        const resultado = await db.query(sql, [id_centro]);

        res.json({
            id_centro: parseInt(id_centro, 10),
            total_turnos: resultado.rows.length,
            turnos: resultado.rows
        });

    } catch (error) {
        console.error("Error al obtener disponibilidad:", error);
        res.status(500).json({ error: "Error interno del servidor al consultar la agenda" });
    }
};

module.exports = {
    crearDisponibilidad,
    obtenerDisponibilidadPorCentro
};