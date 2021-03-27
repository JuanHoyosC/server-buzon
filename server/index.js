const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

require('./database');
//Config
app.set('port', process.env.PORT || 4000);

//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({origin: 'http://localhost:4200'}));

//routers
app.use(require('./routes/email.router'));
app.use(require('./routes/usuario.router'));


app.listen(app.get('port'), () => console.log(`listening on http://localhost:${app.get('port')}`));
