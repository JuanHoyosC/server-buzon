const Usuario = require('../models/usuario.model');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy
const jwt = require('jsonwebtoken');

const usuarioController = {};


passport.use('login', new localStrategy({
    usernameField: 'correo',
    passwordField: 'password'
}, async (correo, password, done) => {
    try {

        //Busca en la base de datos el usuario con el correo y password
        const usuario = await Usuario.findOne({correo, password});

        //Si no existe manda un mensaje de error
        if (!usuario) return done(null, false, { status: 'Usuario o contraseña incorrecta' });

        return done(null, usuario, { status: 'Ingreso correctamente' });
    } catch (error) {
        return done(error);
    }
}))


usuarioController.buscarUsuario = async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        try {

            if (err || !user) {
                //const error = new Error('Hubo un error');
                res.json({ status: 'Usuario o contaseña incorrecta' })
                return next(err)
            }

            req.login(user, { session: false }, async (err) => {
                try {
                    if (err) return next(err);

                    //Verifica si se mando un usuario
                    if (!user) {
                        res.status(400).json({ status: 'Usuario o contraseña incorrecta' });
                        return;
                    }

                    const body = { correo: user.correo, id: user._id };
                    //Crea un token apartir del correo y el id, el token vence en 1h
                    const token = jwt.sign({ user: body }, 'top_secret', { expiresIn: 3600 });
                    res.status(200).json({token});
                } catch (e) {
                    return next(e);
                }
            })
        } catch (e) {
            return next(e);
        }
    })(req, res, next)
}


module.exports = usuarioController