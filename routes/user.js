const express = require('express');
const router = express.Router();

// Models
const User = require('../models/User');

/* GET home page. */

const createCertificate = (username, publicKey) => {
    return username + "::" + publicKey;
};

const saveUserToDB = (username, publicKey) => {
    console.log('ok');
};

router.post('api/register', (req, res, next) => {
    const username = req.body.username;
    const publicKey = req.body.publicKey;
    const certificate = createCertificate(username, publicKey);
    saveUserToDB(username, publicKey);

    const user = new User({
        username: username,
        publicKey: publicKey,
        certificate: certificate
    });

    user.save((err, data) => {
        if(err) {
            res.json({
                status: 0,
                extras: err
            });
        } else {
            res.json({
                status: 1,
                extras: data
            })
        }
    });
});

module.exports = router;
