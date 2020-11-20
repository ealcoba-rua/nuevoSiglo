const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');


router.get('/', (req, res) => {
    mysqlConnection.query('SELECT * FROM clientes', (err, rows, fields) => {
        if(!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});


router.get('/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM clientes WHERE CodAbonado = ?', [id], (err, rows, fields) => {
        if(!err) {
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});


router.post('/', (req, res) => {
    const { codAbonado, nombre, ci, direccion, departamento, localidad, tel1, tel2, fechaNac } = req.body;
    const query = `
    CALL clienteAdd (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    mysqlConnection.query(query, [codAbonado, nombre, ci, direccion, departamento, localidad, tel1, tel2, fechaNac], (err, rows, fields) => {
        if(!err) {
            res.json({Status: 'OK'});
        } else {
            console.log(err);
        }
    });
});

router.post('/masivo', (req, res) => {

    let values = [{ codAbonado, nombre, ci, direccion, departamento, localidad, tel1, tel2, fechaNac } = req.body];
    
    
    var query = `INSERT INTO clientes(CodAbonado, Nombre, CI, Direccion, Departamento, Localidad, Tel1, Tel2, FechaNac)
            VALUES ?`;
    mysqlConnection.query(query, values, (err, rows, fields) => {
        if(!err) {
            res.json({Status: 'OK'});
        } else {
            console.log(err);
        }
    });
});
    

module.exports = router;