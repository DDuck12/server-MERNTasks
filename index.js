const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors')

//Crear el server
const app = express();

//Conectar a la base de datos
conectarDB();

//Habilitando Cors
app.use(cors());

// Habilitando express.Json
app.use(express.json({extended: true}))

//Puerto de la app
const port = process.env.port || 4000;

//Importación de las rutas
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/proyectos', require('./routes/proyectos'))
app.use('/api/tareas', require('./routes/tareas'))

//Test del server
/*app.get('/', (req, res) => {
    res.send('Hola mundo')
})*/

//Iniciar el server
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`)
});
