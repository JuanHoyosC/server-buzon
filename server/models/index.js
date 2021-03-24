const {Schema, mongoose, model} = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');


const emailSchema = new Schema({
    asunto: {type: String, required: true},
    tema: {type: String, required: true},
    descripcion: {type: String, required: true},
    anonimato: {type: String, required: true},
    contacto: {type: String, required: false},
    telefono: {type: Number, required: false},
    correo: {type: String, required: false},
    fecha: {type: String, required: true},
    ubicacion: {type: Array, required: true},
    index: {type: Number, required: true}
});


module.exports = model('emails', emailSchema);