const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    publicKey: String,
    certificate: String
});

module.exports = mongoose.model('user', UserSchema);

