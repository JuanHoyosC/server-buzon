const express = require('express');
const router = express.Router();
const multer = require('multer')

const emailController = require('../controllers/index');


//Configura donde se guardaran los archivos y con que nombre
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, './uploads') },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname)
    }
})

// Se iniicializa multer
const upload = multer({ storage });


//Se encarga de enviar el correo
router.post('/email', emailController.guardarEmail);

//Se encarga de subir los archivos en el servidor
router.post('/', upload.any(), async (req, res) => {
    try {
        //Envia al front la ruta y el nombre de los archivos subidos
        res.status(200).json(req.files.map(file => ({
            ubicacion: file.path,
            name: file.originalname
        })));

    } catch (error) {
        res.status(404).json({
            error: 'Hubo un error subiendo los archivos'
        });
    }
})


module.exports = router;