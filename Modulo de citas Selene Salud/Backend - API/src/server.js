// Importación de la aplicación Express configurada en app.js
const app = require("./app");

// Define el puerto usando la variable de entorno del .env o el 3000 por defecto
const PORT = process.env.PORT || 3000;

// Arranca el servidor HTTP
app.listen(PORT, () => {
    // Mensajes informativos idénticos a los de las prácticas del curso
    console.log(`API funcionando en http://localhost:${PORT}`);
    console.log(`Health: http://localhost:${PORT}/api/health`);
});