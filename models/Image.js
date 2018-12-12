const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageScheme = new Schema({
    username: String,
    imageName: String,
    digitalSignature: String,
    encryptedAESKey: String,
    iv: String
});

module.exports = mongoose.model('image', ImageScheme);

