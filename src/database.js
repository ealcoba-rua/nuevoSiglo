const mysql = require('mysql');



const mysqlConnection = mysql.createConnection({
    host: 'db01.rua-asistencia.com',
    user: 'phpmyadmin',
    password: '1q2w3e*12QQ*',
    database: 'nuevoSiglo',
    multipleStatements: true
});


mysqlConnection.connect(function (err) {
    if(err) {
        console.log(err);
        return;
    } else {
        console.log('Data Base connected');
    }
});


module.exports = mysqlConnection;