const moment = require('moment');
moment.locale('es');

//Hechos desde el servidor
const Email = require('../models/index');
const verificar = require('./verificacion');
const sendEmail = require('../services/emailService');


const EmailController = {}

const obtenerIndex = async () => {
    const email = await Email.find();
    return email.length;
}

EmailController.guardarEmail = async (req, res) => {
    try {

        //Obtiene los datos enviados desde el req.body
        const { descripcion, tipoAsunto, tipoTema, ubicacion, anonimato, contacto, telefono, correo } = req.body;
        console.log('pda')
        //Verifica que los datos enviados esten correctos
        if (!verificar(req.body)) {
            res.status(404).json({ status: 'Datos enviados erroneamente' });
            return;
        }

        //Identificador 
        const id = await Email.find();
        console.log(id.length)
        //Datos requeridos
        let email = { index: id.length, asunto: tipoAsunto, tema: tipoTema, anonimato, descripcion, ubicacion, fecha: moment(new Date()).format('MMMM Do YYYY, h:mm:ss a') };
        console.log('sdfasga')
        //Verifica si es anonimo o no
        if (anonimato !== 'Si') {
            email = { contacto, ...email };
            //Verifica si se manda el telegono o el correo
            if (contacto !== 'De forma presencial') {
                email = contacto === 'Vía telefonica' ? ({ telefono, ...email }) : ({ correo, ...email });
            }

        }

        const saveEmail = new Email(email);

        const { _id, index }  = await saveEmail.save();
        sendEmail(req, _id, index);

        return res.status(200).json({ status: 'Correo enviado correctamente' });

    } catch (error) {
        res.status(404).status({ status: 'Hubo un error, intentelo de nuevo' })
    }
}


module.exports = EmailController