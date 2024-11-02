const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8080;

app.use(bodyParser.json());

// Simular el contenido del "libro"
let bookContent = "Este es el inicio del libro. Puedes editar este contenido.";

// Ruta para obtener el contenido del libro
app.get('/book', (req, res) => {
    res.json({ content: bookContent });
});

// Ruta para actualizar el contenido del libro
app.put('/book', (req, res) => {
    const { content } = req.body;
    if (content) {
        bookContent = content;
        res.json({ message: "Contenido del libro actualizado." });
    } else {
        res.status(400).json({ error: "No se proporcionó contenido para actualizar." });
    }
});

// Inicio del servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
