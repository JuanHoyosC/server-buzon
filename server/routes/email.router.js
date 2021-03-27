const express = require('express');
const router = express.Router();
const multer = require('multer')

const jwt = require('jsonwebtoken');

const emailController = require('../controllers/email.controller');


//Para proteger las rutas

const rutasProtegidas = express.Router(); 
rutasProtegidas.use((req, res, next) => {
    const token = req.headers['access-token'];
 
    if (token) {
      jwt.verify(token, 'top_secret', (err, decoded) => {      
        if (err) {
          return res.json({ status: 'Token inválido' });    
        } else {
          req.decoded = decoded;    
          next();
        }
      });
    } else {
      res.json({status: 'Token no enviado'});
    }
 });

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

//Se encarga de enviar al front todas los mensajes enviados al buzon
router.get('/emails',rutasProtegidas, emailController.obtenerBuzon );

/* 
router.post('/descarga', rutasProtegidas, emailController.descargaArchivos);
*/

//Se encarga de enviar al front los archivos en un zip
router.post('/descargaZip', rutasProtegidas, emailController.descargaArchivosZip);


//Se ecarga de actualizar el leido

router.post('/marcarLeido', rutasProtegidas, emailController.marcarLeido );


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
