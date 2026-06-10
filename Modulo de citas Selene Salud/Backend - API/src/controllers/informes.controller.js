const db = require("../config/db");

/**
 * 1. CREAR UN INFORME MÉDICO / ENTRADA EN HISTORIAL
 * POST /api/informes
 * Protegido: Solo MEDICO
 */
const crearInforme = async (req, res) => {
    const { id_cita, id_paciente, diagnostico, tratamiento, observaciones } = req.body;
    const id_medico = req.usuarioLogueado.id; // El médico que firma es el del token

    if (!id_cita || !id_paciente || !diagnostico || !tratamiento) {
        return res.status(400).json({ error: "Faltan campos obligatorios para redactar el informe" });
    }

    try {
        // 1. Iniciamos una Transacción SQL para asegurar consistencia absoluta
        // Si falla la inserción del informe, no se cambia el estado de la cita.
        await db.query("BEGIN");

        // 2. Insertar el informe médico en la base de datos
        const sqlInforme = `
            INSERT INTO historial_clinico (id_paciente, id_medico, id_cita, diagnostico, tratamiento, observaciones)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const resInforme = await db.query(sqlInforme, [id_paciente, id_medico, id_cita, diagnostico, tratamiento, observaciones]);

        // 3. ACTUALIZACIÓN AUTOMÁTICA DE ESTADO (Lo que comentabas de mover la cita de sitio)
        // Al generar el informe, la cita pasa de 'PROGRAMADA' a 'COMPLETADA' automáticamente
        const sqlCita = `
            UPDATE citas 
            SET estado = 'COMPLETADA' 
            WHERE id = $1;
        `;
        await db.query(sqlCita, [id_cita]);

        // Si todo ha ido bien, consolidamos los cambios en Neon
        await db.query("COMMIT");

        res.status(201).json({
            mensaje: "Informe médico registrado y consulta completada con éxito",
            informe: resInforme.rows[0]
        });

    } catch (error) {
        // Si hay cualquier error, deshacemos todos los cambios parciales para no corromper la BBDD
        await db.query("ROLLBACK");
        console.error("Error al crear informe clínico:", error);
        res.status(500).json({ error: "Error interno del servidor al procesar el informe médico" });
    }
};

/**
 * 2. OBTENER EL HISTORIAL CLÍNICO DE UN PACIENTE
 * GET /api/informes/paciente/:id_paciente
 * Protegido: PACIENTE (el suyo propio), MEDICO y ADMIN (cualquiera)
 */
const obtenerHistorialPaciente = async (req, res) => {
    const { id_paciente } = req.params;
    const usuarioLogueado = req.usuarioLogueado;

    // Control de seguridad estricto para la LOPD:
    // Un paciente no puede escribir en la URL el ID de otro paciente para cotillear su historial
    if (usuarioLogueado.rol === "PACIENTE" && usuarioLogueado.id !== parseInt(id_paciente, 10)) {
        return res.status(403).json({ error: "Acceso denegado. No tienes autorización para ver el historial clínico de otro paciente." });
    }

    try {
        // Consulta avanzada con JOIN para ver qué médico le atendió y en qué fecha
        const sql = `
            SELECT h.id AS informe_id, h.diagnostico, h.tratamiento, h.observaciones, h.fecha_registro,
                   u.nombre AS medico_nombre, u.apellidos AS medico_apellidos,
                   c.fecha_hora AS fecha_cita
            FROM historial_clinico h
            JOIN usuarios u ON h.id_medico = u.id
            JOIN citas c ON h.id_cita = c.id
            WHERE h.id_paciente = $1
            ORDER BY h.fecha_registro DESC;
        `;
        const resultado = await db.query(sql, [id_paciente]);

        res.json({
            id_paciente: parseInt(id_paciente, 10),
            total_informes: resultado.rows.length,
            historial: resultado.rows
        });

    } catch (error) {
        console.error("Error al obtener historial clínico:", error);
        res.status(500).json({ error: "Error interno del servidor al consultar el historial" });
    }
};

module.exports = {
    crearInforme,
    obtenerHistorialPaciente
};