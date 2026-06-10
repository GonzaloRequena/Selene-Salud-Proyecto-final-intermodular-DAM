const { Pool } = require('pg');
require('dotenv').config(); // Carga la URL desde el archivo .env

// Configura el Pool añadiendo el soporte SSL obligatorio para Neon + Render
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Requisito estricto de las conexiones seguras en la nube
    }
});

// Función auxiliar para realizar consultas (Idéntica a la lógica vista en el curso)
const query = (text, params) => pool.query(text, params);

module.exports = {
    query
};