const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {
    //Verifica si hay errores en la validación
    const errores = validationResult(req);
    if(!errores.isEmpty() ) {
        return res.status(400).json({errores: errores.array()})
    }

    //Extraer email y password
    const {email, password} = req.body;

    try {
        //Verificar que sea un usuario registrado
        let usuario = await Usuario.findOne({email});
        if (!usuario) {
            return res.status(400).json({msg: 'Usuario inexistente'})
        }

        //Verificación del password
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if(!passCorrecto) {
            return res.status(400).json({msg: 'Password incorrecto'})
        }

        //Si la validación es correcta Crear y firmar JWT
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
        console.log(error)
    }
}

//Obtener el usuario autenticado
exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password')
        res.json({usuario});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}