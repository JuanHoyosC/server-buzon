const temas = ['Interno de la unidad', 'Interno al CJF', 'Externo al CJF'];
const asuntos = ['Denuncia', 'Queja', 'Sugerencia', 'Inconformidad'];
const contactos = ['Vía telefonica', 'Vía correo', 'De forma presencial'];

const verificacion = ({ descripcion, tipoAsunto, tipoTema, anonimato, contacto, telefono, correo, nombreC }) => {
    if (!temas.find(tema => tema === tipoTema)) return false;
    if (!asuntos.find(asunto => asunto === tipoAsunto)) return false;
    if (descripcion.trim() === '' || descripcion.trim().length < 5) return false;
    if (anonimato !== 'Si' && anonimato !== 'No') return false;
    if (anonimato === 'No') {
        if(nombreC.trim() === '') return false;
        if (!contactos.find(c => c === contacto)) return false;
        if (contacto === 'Vía telefonica') {
            if (isNaN(telefono)) return false;
        } else {
            if (contacto === 'Vía correo') {
                const regex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
                if (!regex.test(correo)) return false;
            }
        }
    }
    return true;
}


module.exports = verificacion