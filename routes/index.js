const express = require('express');
const router = express.Router();

const request = require('request');
/* GET home page. */
router.get('/', (req, res, next) => {


  res.json({
    status:0
  });
});

module.exports = router;
