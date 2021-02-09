const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {
    //console.log(req.body);

    //Verifica si hay errores en la validación
    const errores = validationResult(req);
    if(!errores.isEmpty() ) {
        return res.status(400).json({errores: errores.array()})
    }

    //Extraer email y password
    const {email, password} = req.body;

    try {
        //Validar que el usuario sea unico
        let usuario = await Usuario.findOne({email});

        if(usuario) {
            return res.status(400).json({msg: 'El usuario ya existe'})
        }

        //Creando el usuario nuevo
        usuario = new Usuario(req.body);
        
        //Hash de la password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        //Guardando el usuario
        await usuario.save();

        //Crear y firmar JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        //Firma del JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 //El token dura una hora
        }, (error, token) => {
            if(error) throw error;

             //Mensaje de confirmación
            res.json({ token })
        })

       
    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error')
    }
};