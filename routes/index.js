const express = require('express');
const router = express.Router();

const request = require('request');
/* GET home page. */
router.get('/', (req, res, next) => {
  const options = {
    url: 'http://localhost:3000/socket/trig',
    headers: {
      username: 'bilgehannal',
      imageName: 'imageName',
      imageId: 'image id'
    }
  };
  
  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      const info = JSON.parse(body);
    }
  }
  request(options, callback);

  res.json({
    status:0
  });
});

module.exports = router;
