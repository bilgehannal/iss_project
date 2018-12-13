const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const keyPairOfServer = require('../config');
const QuickEncrypt = require('quick-encrypt');
const helper = require('../helper/helperFunctions');
const fs = require('fs');
const url = require('url');
/* GET home page. */

router.get('/helper/keyPair', (req, res, next) => {
 
    // --- RSA Keypair Generation ---
    let keys = QuickEncrypt.generate(1024) // Use either 2048 bits or 1024 bits.
    let publicKey = keys.public      // " -----BEGIN RSA PUBLIC KEY-----\nMIGJAoGBAIXlXZs+0FoIGBc5pjnZZxtvIzdDFtNi3SVi6vf2J...... "
    let privateKey = keys.private   // " -----BEGIN RSA PUBLIC KEY-----\nMIGJAoGBAIXlXZs+0FoIGBc5pjnZZxtvIzdDFtNi3SVi6vf2J...... "

    console.log(publicKey)
    console.log()
    console.log(privateKey)

    res.json({
        status: 1,
        extras: {
            publicKey: publicKey,
            privateKey: privateKey
        }
    });
});

router.get('/helper/rsaGenerate', (req, res, next) => {
    const key = helper.AESKeyCreator()
    const iv = JSON.stringify(crypto.randomBytes(16));
    res.json({
        status: 1,
        extras: {
            key: key,
            iv: iv
        }
    });
});

router.post('/helper/rsaEncrypt', (req, res, next) => {
    let encryptedText = QuickEncrypt.encrypt( req.body.data, req.body.key )
    console.log(encryptedText); // This will print out the ENCRYPTED text, for example : " 01c066e00c660aabadfc320621d9c3ac25ccf2e4c29e8bf4c...... "
    res.json({
        status: 1,
        extras: {
            encryptedData: encryptedText
        }
    });
});

router.post('/helper/rsaDecrypt', (req, res, next) => {
    let decryptedText = QuickEncrypt.decrypt( req.body.encryptedData, req.body.privateKey)
    console.log(decryptedText) // This will print out the DECRYPTED text, which is " This is some super top secret text! "
    res.json({
        status: 1,
        extras: {
            decryptedData: decryptedText
        }
    });
});



// router.get('/crypto/privateEncrypt', (req, res, next) => {

// });

// router.get('/crypto/privateDcrypt', (req, res, next) => {

// });

// router.post('/crypto/encryptImage', (req, res, next) => {

//     encryptor.encryptFile('./config.js', 'encrypted.dat', key, function(err) {
//         // Encryption complete.
//       });

//       encryptor.decryptFile('./encrypted.dat', '12.js', key, function(err) {
//         console.log('asdasd');
//       });

    

// });


router.get('/serverPublicKey', (req, res, next) => {
    res.json({
        status: 1,
        extras: {
            publicKey: keyPairOfServer.keyPair.publicKey
        }
    });
});


module.exports = router;
