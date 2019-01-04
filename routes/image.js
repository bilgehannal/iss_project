const express = require('express');
const router = express.Router();
const QuickEncrypt = require('quick-encrypt');
const Image = require('../models/Image');
const User = require('../models/User');
const request = require('request');

router.post('/api/image', (req, res, next) => {
    if(req.files) {
        const file = req.files.image;
        file.mv(__dirname + "/./storage/" + file.name, (err) => {
            if(err) {
                console.log('here: ' + "./storage/" + file.name)
                res.json({status: 0,
                    extras: err    
                });
            } else {
                const image = new Image({
                    username: req.body.username,
                    imageName: file.name,
                    digitalSignature: req.body.digitalSignature,
                    encryptedAESKey: req.body.encryptedAESKey,
                    iv: req.body.iv
                });
                image.save((err, data) => {
                    if(err) {
                        res.json({status: 0});
                    } else {
                        const options = {
                            url: 'http://46.101.188.235:3001/socket/trig',
                            headers: {
                              username: 'testNameISS',
                              imageName: 'test.jpg1.dat',
                              imageId: '5c2f375cf84852797b6dea5b'
                            }
                          };
                          
                          function callback(error, response, body) {
                            if (!error && response.statusCode == 200) {
                              const info = JSON.parse(body);
                            }
                          }
                          request(options, callback);
                        res.json({
                            status: 1,
                            extras: data
                        });
                    }
                });
            }
        });
    } else {
        res.json({status:0});
    }
});

router.get('/api/imageInfo', (req, res, next) => {
    const id = req.headers._id;
    const username = req.headers.username;

    Image.find(id, (err, data) => {
        if(err) {
            res.json({status: 0});
        } else {
            const imageName = data.name;
            const signature = data.digitalSignature;
            User.findOne({username: data.username}, (err, data2) => {
                if(err) {res.json({status: 0});}
                else {
                    const realAES = QuickEncrypt.decrypt( data2.encryptedAESKey, data2.publicKey);
                    User.findOne({username: username}, (err, data3) => {
                        if(err) {res.json({status: 0});}
                        else {
                            res.json({
                                status: 1,
                                extras: {
                                    imageName: imageName,
                                    digitalSignature: signature,
                                    publicKey: data2.username,
                                    encryptedAES: QuickEncrypt.encrypt( realAES, data3.publicKey )
                                }
                            });
                        }
                    });
                }
            });
        }
    });


});

router.get('/api/imageDownload', (req, res, next) => {
    const name = req.headers.name;
    res.sendFile(__dirname + '/storage/'+name);
  });

router.get('/asd', (req, res, next) => {
    res.json({
      status:0
    });
  });

module.exports = router;
