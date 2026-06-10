const db = require("../config/db");

/**
 * 1. RESERVAR UNA NUEVA CITA
 * POST /api/citas
 * Protegido: Solo PACIENTE (un admin también podría si se extendiera, pero priorizamos paciente)
 */
const crearCita = async (req, res) => {
    const { id_medico, id_centro, fecha_hora } = req.body;
    const usuarioLogueado = req.usuarioLogueado;

    // Control estricto de seguridad: El paciente es el usuario del token
    let id_paciente = usuarioLogueado.id;

    if (!id_medico || !id_centro || !fecha_hora) {
        return res.status(400).json({ error: "Faltan campos indispensables (id_medico, id_centro, fecha_hora)" });
    }

    try {
        // Validación de seguridad para asegurar que no se pida cita a ciegas
        // Comprobamos si el médico trabaja de verdad en ese centro
        const queryRelacion = "SELECT * FROM medicos_centros WHERE id_medico = $1 AND id_centro = $2";
        const resRelacion = await db.query(queryRelacion, [id_medico, id_centro]);

        if (resRelacion.rows.length === 0) {
            return res.status(400).json({ error: "El médico seleccionado no pasa consulta en ese centro médico." });
        }

        // Insertar la cita en la tabla 'citas'
        // El estado por defecto será 'PROGRAMADA' y estado_pago 'NO_APLICA' tal como pusiste en el SQL
        const sql = `
            INSERT INTO citas (id_paciente, id_medico, id_centro, fecha_hora)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const valores = [id_paciente, id_medico, id_centro, fecha_hora];
        const resultado = await db.query(sql, valores);

        res.status(201).json({
            mensaje: "¡Cita médica reservada con éxito!",
            cita: resultado.rows[0]
        });

    } catch (error) {
        console.error("Error al crear cita:", error);
        res.status(500).json({ error: "Error interno del servidor al agendar la cita" });
    }
};

/**
 * 2. OBTENER HISTORIAL / PRÓXIMAS CITAS ("Mis Citas")
 * GET /api/citas/mis-citas
 * Protegido: PACIENTE y MEDICO (Es dinámico según el Rol del token)
 */
const obtenerMisCitas = async (req, res) => {
    const { id, rol } = req.usuarioLogueado;

    try {
        let sql = "";
        let valores = [id];

        // DEMOSTRACIÓN DE ROL DINÁMICO PARA EL TFG:
        if (rol === "PACIENTE") {
            // Si es paciente, queremos ver los datos del médico y del hospital donde va
            sql = `
                SELECT c.id AS cita_id, c.fecha_hora, c.estado, c.id_paciente, c.estado_pago,
                       u.nombre AS medico_nombre, u.apellidos AS medico_apellidos,
                       cs.nombre AS centro_nombre, cs.municipio AS centro_municipio
                FROM citas c
                JOIN usuarios u ON c.id_medico = u.id
                JOIN centros_salud cs ON c.id_centro = cs.id
                WHERE c.id_paciente = $1
                ORDER BY c.fecha_hora DESC;
            `;
        } else if (rol === "MEDICO") {
            // Si es médico, quiere ver qué pacientes tiene que atender y en qué hospital
            sql = `
                SELECT c.id AS cita_id, c.fecha_hora, c.estado, c.id_paciente,
                       u.nombre AS paciente_nombre, u.apellidos AS paciente_apellidos, u.telefono AS paciente_telefono,
                       cs.nombre AS centro_nombre
                FROM citas c
                JOIN usuarios u ON c.id_paciente = u.id
                JOIN centros_salud cs ON c.id_centro = cs.id
                WHERE c.id_medico = $1
                ORDER BY c.fecha_hora ASC;
            `;
        } else if (rol === "ADMIN") {
            // Si es admin, puede auditar absolutamente todas las citas del sistema
            sql = `
                SELECT c.id AS cita_id, c.fecha_hora, c.estado, c.id_paciente,
                       up.nombre AS paciente_nombre, up.apellidos AS paciente_apellidos,
                       um.nombre AS medico_nombre, um.apellidos AS medico_apellidos,
                       cs.nombre AS centro_nombre
                FROM citas c
                JOIN usuarios up ON c.id_paciente = up.id
                JOIN usuarios um ON c.id_medico = um.id
                JOIN centros_salud cs ON c.id_centro = cs.id
                ORDER BY c.fecha_hora DESC;
            `;
            valores = []; // El admin no filtra por su propio ID
        }

        const resultado = await db.query(sql, valores);
        res.json({
            rol_solicitante: rol,
            total: resultado.rows.length,
            citas: resultado.rows
        });

    } catch (error) {
        console.error("Error al obtener mis citas:", error);
        res.status(500).json({ error: "Error interno del servidor al consultar tus citas" });
    }
};

/**
 * 3. ANULAR / CANCELAR CITA
 * PATCH /api/citas/:id/cancelar
 * Protegido: Cualquier usuario registrado
 */
const cancelarCita = async (req, res) => {
    const { id } = req.params; // ID de la cita
    const usuarioLogueado = req.usuarioLogueado;

    try {
        // Verificar si la cita existe antes de hacer nada
        const queryCheck = "SELECT * FROM citas WHERE id = $1";
        const resCheck = await db.query(queryCheck, [id]);

        if (resCheck.rows.length === 0) {
            return res.status(404).json({ error: "La cita médica no existe" });
        }

        const cita = resCheck.rows[0];

        // Regla de negocio y seguridad: Un paciente solo puede anular SUS propias citas.
        // Los médicos y admins pueden anular cualquier cita bajo su jurisdicción.
        if (usuarioLogueado.rol === "PACIENTE" && cita.id_paciente !== usuarioLogueado.id) {
            return res.status(403).json({ error: "Acceso denegado. No tienes autorización para cancelar la cita de otro paciente." });
        }

        // Modificar el estado a 'ANULADA'
        const sqlUpdate = `
            UPDATE citas 
            SET estado = 'ANULADA' 
            WHERE id = $1 
            RETURNING *;
        `;
        const resultado = await db.query(sqlUpdate, [id]);

        res.json({
            mensaje: "Cita anulada correctamente",
            cita: resultado.rows[0]
        });

    } catch (error) {
        console.error("Error al cancelar cita:", error);
        res.status(500).json({ error: "Error interno del servidor al procesar la cancelación" });
    }
};

module.exports = {
    crearCita,
    obtenerMisCitas,
    cancelarCita
};