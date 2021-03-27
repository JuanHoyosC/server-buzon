const moment = require('moment');
const fs = require("fs");
const admz = require('adm-zip')
moment.locale('es');

//Hechos desde el servidor
const Email = require('../models/email.model');
const verificar = require('../services/verificacion');
const sendEmail = require('../services/emailService');


const EmailController = {}

EmailController.obtenerBuzon = async (req, res) => {
    try {
        const data = await Email.find();
        res.status(200).json(data)
    } catch (error) {
        res.status(400).json({ error: 'Hubo un error' });
    }
}

/*
EmailController.descargaArchivos = async (req, res) => {
    try {
        const { ubicacion } = req.body;
        res.status(200).send(fs.readFileSync(ubicacion));
    } catch (error) {
        res.status(400).json({status: 'Hubo un error en la descarga'});
    }
}
*/

EmailController.descargaArchivosZip = async (req, res) => {
    try {
        const { ubicacion } = req.body;
        const zp = new admz();

        ubicacion.forEach(file => zp.addLocalFile(file.ubicacion))

        res.status(200).send(zp.toBuffer());
    } catch (error) {
        res.status(400).json({status: 'Hubo un error en la descarga'});
    }
}

//Se encarga de actualizar el leido
EmailController.marcarLeido = async (req, res) => {
    try {
       const {id, leido} = req.body;
       await Email.findByIdAndUpdate(id, { leido });
       res.status(200).json({status: 'Leido actualizado'});
    } catch (error) {
        res.status(400).json({status: 'Hubo un error en la actualizacion'});
    }
}

//Se encarga de guardar en la base de datos los correos que se envian
EmailController.guardarEmail = async (req, res) => {
    try {

        //Obtiene los datos enviados desde el req.body
        const { descripcion, nombreC, tipoAsunto, tipoTema, ubicacion, anonimato, contacto, telefono, correo } = req.body;
        //Verifica que los datos enviados esten correctos
        if (!verificar(req.body)) {
            res.status(404).json({ status: 'Datos enviados erroneamente' });
            return;
        }

        //Identificador 
        const id = await Email.find();
        //Datos requeridos
        let email = { index: id.length + 1, leido: false, asunto: tipoAsunto, tema: tipoTema, anonimato, descripcion,  ubicacion, fecha: moment(new Date()).format('MMMM Do YYYY, h:mm:ss a') };
        //Verifica si es anonimo o no
        if (anonimato !== 'Si') {
            email = { contacto, nombreC, ...email };
            //Verifica si se manda el telegono o el correo
            if (contacto !== 'De forma presencial') {
                email = contacto === 'Vía telefonica' ? ({ telefono, ...email }) : ({ correo, ...email });
            }

        }

        const saveEmail = new Email(email);

        const { _id, index } = await saveEmail.save();
        sendEmail(req, _id, index);

        return res.status(200).json({ status: 'Correo enviado correctamente' });

    } catch (error) {
        res.status(404).status({ status: 'Hubo un error, intentelo de nuevo' })
    }
}


module.exports = EmailController
