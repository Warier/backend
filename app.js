const express = require('express');
const configRoutes = require('./Routes/config');
const userRoutes = require('./Routes/user');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/', configRoutes);
app.use('/', userRoutes);


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
});

module.exports = app;