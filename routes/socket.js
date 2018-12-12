const express = require('express');
const router = express.Router();

var arrayOfClients = [];
 
router.ws('/socket', (ws, req) => {
  ws.on('message', (msg) => {
    console.log(msg);
    arrayOfClients.push(ws);
  });

  ws.on('close', req => {
    const index = arrayOfClients.indexOf(ws);
    if (index > -1) {
        arrayOfClients.splice(index, 1);
        console.log('There is a disconnection');
    }
  });

});

const sendNotification = (username, imageName, imageId) => {
    const result = {
        username: username,
        imageName: imageName,
        imageId: imageId
    };
    arrayOfClients.forEach(function(element) {
        element.send(JSON.stringify(result));
    });
};

module.exports.notification = sendNotification;
module.exports = router;
