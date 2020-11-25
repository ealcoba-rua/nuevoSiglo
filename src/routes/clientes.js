const express = require('express');
const { restart } = require('nodemon');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const mysqlConnection = require('../database');


// router.get('/NuevoSiglo/', ensureToken, (req, res) => {
//     jwt.verify(req.token, 'my_secret_key', (err, data) => {
//         if (err) {
//             res.sendStatus(403);
//         } else {

//             mysqlConnection.query('SELECT * FROM clientes', (err, rows, fields) => {
//                 if (!err) {
//                     res.json(rows);
//                 } else {
//                     console.log(err);
//                 }
//             });
//         }
//     });
// });


// router.get('/NuevoSiglo/:id', (req, res) => {
//     const { id } = req.params;
//     mysqlConnection.query('SELECT * FROM clientes WHERE CodAbonado = ?', [id], (err, rows, fields) => {
//         if (!err) {
//             res.json(rows[0]);
//         } else {
//             console.log(err);
//         }
//     });
// });


// router.post('/NuevoSiglo/', (req, res) => {
//     const { codAbonado, nombre, ci, direccion, departamento, localidad, tel1, tel2, fechaNac } = req.body;
//     const query = `
//     SET @codAbonado = ?;
//     SET @nombre = ?;
//     SET @ci = ?;
//     SET @direccion = ?;
//     SET @departaamento = ?;
//     SET @localidad = ?;
//     SET @tel1 = ?;
//     SET @tel2 = ?;
//     SET @fechaNac = ?;
    
//     CALL clienteAdd (@codAbonado, @nombre, @ci, @direccion, @departaamento, @localidad, @tel1, @tel2, @fechaNac);
//     `;
//     mysqlConnection.query(query, [codAbonado, nombre, ci, direccion, departamento, localidad, tel1, tel2, fechaNac], (err, rows, fields) => {
//         if (!err) {
//             res.status(200).json({ Status: 'Succes', data: req.body, });
//         } else {
//             console.log(err);
//         }
//     });
// });


router.post('/NuevoSiglo/Carga', ensureToken, (req, res) => {
    jwt.verify(req.token, 'my_secret_key', (err, data) => {
        if (err) {
            res.sendStatus(403);
        } else {
            let values = [];

            let values2 = [];

            values = req.body;

            for (var i = 0; i < values.length; i++) {
                values2.push([values[i].codAbonado, values[i].nombre, values[i].ci, values[i].direccion, "MVD", "MVD", values[i].tel1, values[i].tel2, values[i].fechaNac]);
            }

            console.log(values);
            console.log(values2);

            var sql = `
    TRUNCATE TABLE clientes;
    INSERT INTO clientes (CodAbonado, Nombre, CI, Direccion, Departamento, Localidad, Tel1, Tel2, FechaNac) VALUES ?;`;

            try {
                mysqlConnection.query(sql, [values2], (err, rows, fields) => {
                    if (!err) {
                        res.status(200).json({ Status: 'OK', Inserted: values2.length });
                    } else {
                        console.log(err);
                    }
                });

            }
            catch (err) {
                console.log(err);
            }
        }

    });
});



router.post('/NuevoSiglo/login', async (req, res) => {
    const user = req.body;
    executeQuery(user.user, function (users) {
        if (users.length) {
            hashPassword(user.password, users[0].password, res);

        } else {
            res.json(false);
        }
    })

});

const hashPassword = async (password, hash, res) => {
    result = await bcrypt.compare(password, hash);
    if (result) {
        const token = jwt.sign({ password }, 'my_secret_key');
        return res.json({ token });
    } else {
        res.json({ result });
    }
}

function executeQuery(user, callback) {
    const query = `SELECT * FROM auth WHERE usuario = ?;`;
    try {
        mysqlConnection.query(query, user, (err, rows) => {
            if (err)
                throw err;
            return callback(rows);
        });

    } catch (e) {
        console.log(e);
    }
}



function setValue(value) {
    someVar = value;
    //console.log(someVar);
    const hash = someVar[0].password + "";
    //console.log(hash);
    return hash;
}

// router.post('/NuevoSiglo/registro', async (req, res) => {
//     try {
//         let user = req.body.user;
//         let password = req.body.password;
//         let nombre = req.body.nombre;
//         const hash = await bcrypt.hash(password, 10);

//         const query = `INSERT INTO auth (nombre, usuario, password) VALUES  ?;`;
//         mysqlConnection.query(query, [[[nombre, user, hash]]], (err, rows, fields) => {
//             if (!err) {
//                 res.status(200).json({ Status: 'OK' });
//             } else {
//                 console.log(err);
//             }
//         });

//     } catch (e) {
//         console.log(e);
//         res.status(500).send('Something broke');
//     }
// });


function ensureToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader != 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403)
    }
}





module.exports = router;