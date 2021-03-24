const moongoose = require('mongoose');

moongoose.connect('mongodb://localhost/buzon', {
    useNewUrlParser:true,
    useUnifiedTopology: true
})
    .then(db => console.log('Base de datos conectada'))
    .catch(err => console.log(err))