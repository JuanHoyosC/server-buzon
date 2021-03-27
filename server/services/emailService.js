const nodemailer = require('nodemailer');

//Crea el html que se enivara al correo
const crearHtml = ({ descripcion, tipoAsunto, tipoTema, anonimato, contacto, telefono, correo }, _id, index) => {
    let html = `<div style="background: rgb(46, 71, 104); padding: 20px;">
    <p style="color: #fff; font-size: 18px;text-align:center;">Asunto: ${tipoAsunto}</p>
    <p style="color: #fff; font-size: 18px;text-align:center;">Tema: ${tipoTema}</p>
    <p style="color: #fff; font-size: 18px;text-align:center;">Descripción: ${descripcion}</p>
    `;

    const small = `<small  style="color: #fff;text-align:center;"> Identificador en la DB: ${ _id } </small>
    <small  style="color: #fff;text-align:center; float: right;"> Index en la DB: ${ index } </small>
    `

    //Comprueba si sera anonimo o no
    if (anonimato === 'Si') {
        html += `${small}</div>`;

        //Si no es anonimo se verifica si se trabajara con telefono o correo
    } else {
        html += `<p style="color: #fff; font-size: 18px;text-align:center;">Contacto para resolucíon: ${ contacto }</p>`
        if (contacto === 'Vía telefonica') {
            html += `<p style="color: #fff; font-size: 18px;text-align:center;">Telefono: ${telefono}</p>
                    ${small}</div>`;
        } else {
            if (contacto === 'Vía correo') {
                html += `<p style="color: #fff; font-size: 18px;text-align:center;">Correo: ${correo}</p>
                ${small} </div>`;
            } else {
                html += `${small}</div>`;
            }
        }
    }

    return html;
}


const enviarCorreo = ( req, _id, index ) => {
    try {
        const { tipoAsunto, ubicacion } = req.body;
        //Obtiene el html creado apartir de los datos
        const html = crearHtml(req.body, _id, index);
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'juanhoyosc2@gmail.com',
                pass: 'jnpuozgxdvlyexze'
            }
        });

        // obtiene los archivos del server para adjuntarlos al correo
        //const attachments = ubicacion.map((file) => ({ filename: file.name, path: file.ubicacion }));

        // Configuraciones del correo
        const mail_option = {
            from: `${tipoAsunto} <juanhoyosc2@gmail.com>`,
            to: 'juanhoyosc2@gmail.com',
            subject: `${tipoAsunto}`,
            html: html
        }

        //Envio del correo
        transporter.sendMail(mail_option, (error, info) => {
            if (error) {
                console.log('error', error)
                return ({ status: 'Hubo un error al enviar el correo' });
                
           
            }

            console.log('enviado')
        })

    } catch (error) {
        
    }
}

module.exports = enviarCorreo
