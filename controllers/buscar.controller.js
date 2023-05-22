const { request, response } = require("express");
const { ObjectId } = require("mongoose").Types;
const { Usuario, Horario, Actividad, Agenda } = require('../models')

const coleccionesPermitidas = [
,
    'actividades',
    'roles',
    'usuarios',
    'agendas'
];

const buscarHorario = async (req= request, res = response) => {

    const { params, query } = req;
    console.log({ params, query })
    const aggregate = [
        {
            '$lookup': {
                'from': 'agendas',
                'localField': '_id',
                'foreignField': 'horario',
                'as': 'horario-agenda'
            }
        }, {
            '$lookup': {
                'from': 'usuarios',
                'localField': 'horario-agenda.usuario',
                'foreignField': '_id',
                'as': 'horario-agenda.usuario.detalles'
            }
        }, {
            '$lookup': {
                'from': 'actividads',
                'localField': 'actividad',
                'foreignField': '_id',
                'as': 'actividad-detalle'
            }
        }, {
            '$unwind': {
                'path': '$actividad-detalle',
                'includeArrayIndex': 'string',
                'preserveNullAndEmptyArrays': false
            }
        }, {
            '$project': {
                '_id': '$_id',
                'dia': '$dia',
                'desde': '$desde',
                'hasta': '$hasta',
                'sala': '$sala',
                'actividadId': '$actividad-detalle._id',
                'actividadNombre': '$actividad-detalle.actividad',
                'precio': '$actividad-detalle.precio',
                'usuarios': '$horario-agenda.usuario.detalles'
            }
        }, {
            '$unset': 'usuarios.password'
        }
    ]

    const filters = {};
    if(query.precio) {
        filters.precio = +query.precio
    }
    if(query.actividad) {  
        filters.actividadNombre =  query.actividad.toUpperCase()
    }
    if(query.dia) {      
        filters.dia =  query.dia
 
    }
    // if(query.desde & query.hasta) {  
    //     filters.actividadNombre =  query.actividad.toUpperCase()
    // }
    // if(query.actividad) {  
    //     filters.actividadNombre =  query.actividad.toUpperCase()
    // }

    const match = {
        // '$match': {
        //     'dia': 'Lunes',
        //     'desde': '11:30',
        //     'hasta': '12:30',
        //     'sala': {
        //         '$regex': new RegExp('quintela', 'i')
        //     },
        //     'actividadId': new ObjectId('645d09d02abdd115e0f6df73'),
        //     'actividadNombre': {
        //         '$regex': new RegExp('pila', 'i')
        //     },
        //     'usuarios.telefono': "600600600",
        //     'usuarios.dni': '1572368X',
        //     'usuarios.correo': {
        //         '$regex': new RegExp('almu85pere24@gmail.com', 'i')
        //     },
        //     'usuarios.nombre': {
        //         '$regex': new RegExp('almudena', 'i')
        //     }
        // }

        '$match': { ...filters }
    };
    console.log(match)

    const sort = {
        '$sort': {
            'nombreActividad': 1
        }
    }

    aggregate.push(match);
    aggregate.push(sort)

    // console.log({aggregate})

    const results = await Horario.aggregate(aggregate);
    console.log(results)

    return res.status(200).json(results);
}

// const buscarHorario = async (termino = '', req, res = response) => {

//     const { params, query } = req;
//     console.log({ params, query })
//     // const esMongoID = ObjectId.isValid(termino);
//     // if (esMongoID) {
//     //     const horario = await Horario.findById(termino)
//     //     return res.status(200).json({
//     //         results: (horario) ? [horario] : []
//     //     })
//     // }
//     // const regex = new RegExp(termino, 'i');

//     // const horarios = await Horario.find({
//     //     $or: [{ horario: regex }],
//     //     $and: [{ estado: true }]
//     // });


//     // return res.status(200).json({
//     //     results: (horarios) ? [horarios] : []
//     // })

//     // -------------------------------------------------

//     // Aggregate definition
//     // [
//     //     {
//     //       '$lookup': {
//     //         'from': 'agendas', 
//     //         'localField': '_id', 
//     //         'foreignField': 'horario', 
//     //         'as': 'horario-agenda'
//     //       }
//     //     }, {
//     //       '$lookup': {
//     //         'from': 'usuarios', 
//     //         'localField': 'horario-agenda.usuario', 
//     //         'foreignField': '_id', 
//     //         'as': 'horario-agenda.usuario.detalles'
//     //       }
//     //     }, {
//     //       '$lookup': {
//     //         'from': 'actividads', 
//     //         'localField': 'actividad', 
//     //         'foreignField': '_id', 
//     //         'as': 'actividad-detalle'
//     //       }
//     //     }, {
//     //       '$unwind': {
//     //         'path': '$actividad-detalle', 
//     //         'includeArrayIndex': 'string', 
//     //         'preserveNullAndEmptyArrays': false
//     //       }
//     //     }, {
//     //       '$project': {
//     //         '_id': '$_id', 
//     //         'dia': '$dia', 
//     //         'desde': '$desde', 
//     //         'hasta': '$hasta', 
//     //         'sala': '$sala', 
//     //         'actividadId': '$actividad-detalle._id', 
//     //         'actividadNombre': '$actividad-detalle.actividad', 
//     //         'precio': '$actividad-detalle.precio', 
//     //         'usuarios': '$horario-agenda.usuario.detalles'
//     //       }
//     //     }, {
//     //       '$unset': 'usuarios.password'
//     //     }, {
//     //       '$match': {
//     //         'dia': 'Lunes', 
//     //         'desde': '11:30', 
//     //         'hasta': '12:30', 
//     //         'sala': {
//     //           '$regex': new RegExp('quintela', 'i')
//     //         }, 
//     //         'actividadId': new ObjectId('645d09d02abdd115e0f6df73'), 
//     //         'actividadNombre': {
//     //           '$regex': new RegExp('pila', 'i')
//     //         }, 
//     //         'usuarios.telefono': "600600600", 
//     //         'usuarios.dni': '1572368X', 
//     //         'usuarios.correo': {
//     //           '$regex': new RegExp('almu85pere24@gmail.com', 'i')
//     //         }, 
//     //         'usuarios.nombre': {
//     //           '$regex': new RegExp('almudena', 'i')
//     //         }
//     //       }
//     //     }, {
//     //       '$sort': {
//     //         'nombreActividad': 1
//     //       }
//     //     }
//     //   ]

//     const aggregate = [
//         {
//             '$lookup': {
//                 'from': 'agendas',
//                 'localField': '_id',
//                 'foreignField': 'horario',
//                 'as': 'horario-agenda'
//             }
//         }, {
//             '$lookup': {
//                 'from': 'usuarios',
//                 'localField': 'horario-agenda.usuario',
//                 'foreignField': '_id',
//                 'as': 'horario-agenda.usuario.detalles'
//             }
//         }, {
//             '$lookup': {
//                 'from': 'actividads',
//                 'localField': 'actividad',
//                 'foreignField': '_id',
//                 'as': 'actividad-detalle'
//             }
//         }, {
//             '$unwind': {
//                 'path': '$actividad-detalle',
//                 'includeArrayIndex': 'string',
//                 'preserveNullAndEmptyArrays': false
//             }
//         }, {
//             '$project': {
//                 '_id': '$_id',
//                 'dia': '$dia',
//                 'desde': '$desde',
//                 'hasta': '$hasta',
//                 'sala': '$sala',
//                 'actividadId': '$actividad-detalle._id',
//                 'actividadNombre': '$actividad-detalle.actividad',
//                 'precio': '$actividad-detalle.precio',
//                 'usuarios': '$horario-agenda.usuario.detalles'
//             }
//         }, {
//             '$unset': 'usuarios.password'
//         }
//     ]

//     const filters = {};
//     if(query.precio) {
//         filters.precio = +query.precio
//     }

//     const match = {
//         // '$match': {
//         //     'dia': 'Lunes',
//         //     'desde': '11:30',
//         //     'hasta': '12:30',
//         //     'sala': {
//         //         '$regex': new RegExp('quintela', 'i')
//         //     },
//         //     'actividadId': new ObjectId('645d09d02abdd115e0f6df73'),
//         //     'actividadNombre': {
//         //         '$regex': new RegExp('pila', 'i')
//         //     },
//         //     'usuarios.telefono': "600600600",
//         //     'usuarios.dni': '1572368X',
//         //     'usuarios.correo': {
//         //         '$regex': new RegExp('almu85pere24@gmail.com', 'i')
//         //     },
//         //     'usuarios.nombre': {
//         //         '$regex': new RegExp('almudena', 'i')
//         //     }
//         // }

//         '$match': { ...filters }
//     };

//     const sort = {
//         '$sort': {
//             'nombreActividad': 1
//         }
//     }

//     aggregate.push(match);
//     aggregate.push(sort)

//     console.log({aggregate})

//     const results = await Horario.aggregate(aggregate);

//     return res.status(200).json(results);
// }

const buscarActividades = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    if (esMongoID) {
        const actividad = await Actividad.findById(termino).populate('actividad', 'precio')
        console.log(actividad);
        return res.status(200).json({
            results: (actividad) ? [actividad] : []
        })
    }

    //búsquedas insensibles. //Expresion regular importada de JS 
    //insensible a mayusculas y minusculas.
    const regex = new RegExp(termino, 'i');
    console.log(regex);
    const actividades = await Actividad.find({
        $or: [{ actividad: regex }], //¿Como hacer la búsqueda por precio??
        $and: [{ estado: true }]

    })

    return res.status(200).json({
        results: (actividades) ? [actividades] : []
    })

}
const buscarAgendas = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    if (esMongoID) {
        const agenda = await Agenda.findById(termino).populate('horario', 'usuario')
        console.log(agenda);
        return res.status(400).json({
            results: (agenda) ? [agenda] : []
        })
    }

    const regex = new RegExp(termino, 'i');
    console.log(regex);
    const agendas = await Agenda.find({
        $or: [{ agenda: regex }], //¿Como hacer la búsqueda por precio??
        $and: [{ estado: true }]

    }).populate('horario', 'horario').populate('usuario', 'nombre');


    return res.status(400).json({
        results: (agendas) ? [agendas] : []
    })

}

const buscarRoles = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    console.log(termino);
    if (esMongoID) {
        const usuario = await Usuario.findById(termino)
        console.log(usuario);
        return res.status(200).json({
            results: (usuario) ? [usuario.nombre, usuario.rol] : []
        })
    }

    //búsquedas insensibles. //Expresion regular importada de JS 
    //insensible a mayusculas y minusculas.
    const regex = new RegExp(termino, 'i');
    console.log(regex);
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { rol: regex }],
        $and: [{ estado: true }]
    });


    return res.status(400).json({
        results: (usuarios) ? [usuarios] : []
    })

}

const buscarUsuarios = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    console.log(termino);
    if (esMongoID) {
        const usuarios = await Usuario.findById(termino)
        console.log(usuarios)
        const usuario = usuarios.toJSON()
        console.log(usuario)
        const agendas = await Agenda.find({ "usuario": usuario.uid })
        console.log(agendas)
        // const agenda = agendas.toJSON()
        // const horarios = await Horario.findById({"_id" : agenda.horario})
        // console.log(horarios)

        return res.status(200).json({
            results: (usuarios, agendas)
                ? [usuarios, agendas]
                : []
        })
    }

    //búsquedas insensibles. //Expresion regular importada de JS 
    //insensible a mayusculas y minusculas.
    const regex = new RegExp(termino, 'i');
    console.log(regex)
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }, { dni: regex }],
        $and: [{ estado: true }]
    });


    return res.status(200).json({
        results: (usuarios) ? [usuarios] : []
    })

}

const buscar = (req=request, res = response) => {
    const coleccionPermitida ='horarios'

    const { coleccion } = req.params;
    if (!coleccionPermitida.includes(coleccion)) {
        res.status(400).json({
            message: `Las coleccion permitida es: ${coleccionPermitida}`,
        })
    }
    switch (coleccion) {
        case 'horarios':
            buscarHorario(req, res);
            break;  
    }
}
const buscarResto = (req, res = response) => {

    const { coleccion, termino } = req.params;
    if (!coleccionesPermitidas.includes(coleccion)) {
        res.status(400).json({
            message: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
        })
    }
    switch (coleccion) {
        case 'actividades':
            buscarActividades(termino, res);
            break;
        case 'roles':
            buscarRoles(termino, res)
            break;
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'agendas':
            buscarAgendas(termino, res);
            break;
        default:
            res.status(500).json({
                message: `Se me olvidó hacer la búsqueda `,
            })
    }
}

module.exports = {
    buscar,
    buscarHorario,
    buscarActividades,
    buscarRoles,
    buscarUsuarios,
    buscarResto

}