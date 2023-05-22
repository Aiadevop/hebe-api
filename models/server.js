const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../database/config');

class Server {


    constructor() {
        //Creamos express como una propiedad en el servidor.
        this.app = express();
        this.port = process.env.PORT;
       

        this.paths = {
            auth:           '/api/auth',            
            buscar:         '/api/buscar',
            horarios:       '/api/horarios',
            actividades:    '/api/actividades',
            usuarios:       '/api/usuarios', 
            agendas:        '/api/agendas'
            
        }

        //Conectar a la base de datos
        this.conectarDB();

        //Middlewares (función que siempre se ejecuta al levantar nuestro servidor.)
        this.middlewares();

        //Rutas de mi aplicación.
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {

        //CORS
        this.app.use(cors());

        //Lectura y parseo del body
        //Cualquier información del front-end la va a intentar serializar a un JSON
        this.app.use(express.json());

        //.use es la palabra clave para determinar que es un middleware.
        this.app.use(express.static('public'));

    }

    //Método con las rutas.
    routes() {

        this.app.use(this.paths.auth, require('../routes/auth')); 
        this.app.use(this.paths.buscar,require('../routes/buscar'));       
        this.app.use(this.paths.horarios, require('../routes/horarios'));
        this.app.use(this.paths.actividades, require('../routes/actividades'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.agendas, require('../routes/agendas'));
    }

    //Puerto que escucha
    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto:', this.port);
        });
    }
}

module.exports = Server;