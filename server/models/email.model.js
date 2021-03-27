const {Schema, model} = require('mongoose');

const emailSchema = new Schema({
    asunto: {type: String, required: true},
    tema: {type: String, required: true},
    descripcion: {type: String, required: true},
    anonimato: {type: String, required: true},
    fecha: {type: String, required: true},
    ubicacion: {type: Array, required: true},
    index: {type: Number, required: true},
    leido: {type: Boolean, required: true},
    contacto: {type: String, required: false},
    telefono: {type: Number, required: false},
    correo: {type: String, required: false},
    nombreC: {type: String, required: false}
});


module.exports = model('emails', emailSchema);
