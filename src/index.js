const express = require('express'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();


// Settings
app.set('port', process.env.PORT || 3000);



// Middlewares
app.use(express.json());





// Routes
app.use(require('./routes/clientes'));




// Starting server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});