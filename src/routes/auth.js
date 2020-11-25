const express = require('express');
const jwt = require('jsonwebtoken');
const { restart } = require('nodemon');
const router = express.Router();

const mysqlConnection = require('../database');


router.post('/NuevoSiglo/login', (req, res) => {
    const user = {id: 3};
    const token = jwt.sign({user}, 'my_secret_key');
    res.json({
        token
    });
});


module.exports = router;