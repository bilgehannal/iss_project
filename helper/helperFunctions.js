var keyhex = "8479768f48481eeb9c8304ce0a58481eeb9c8304ce0a5e3cb5e3cb58479768f4"; //length 32 
var ivec = require('crypto').randomBytes(16);
function encryptAES(keyhex, iv, input) {
	try {
		//console.info('iv',iv);
		var data = new Buffer(input).toString('binary');
		//console.info('data',data);
		
		key = new Buffer(keyhex, "hex");
		//console.info(key);
		var cipher = require('crypto').createCipheriv('aes-256-cbc', key, iv);
		// UPDATE: crypto changed in v0.10

		// https://github.com/joyent/node/wiki/Api-changes-between-v0.8-and-v0.10 

		var nodev = process.version.match(/^v(\d+)\.(\d+)/);

		var encrypted;

		if( nodev[1] === '0' && parseInt(nodev[2]) < 10) {
			encrypted = cipher.update(data, 'binary') + cipher.final('binary');
		} else {
			encrypted =  cipher.update(data, 'utf8', 'binary') +  cipher.final('binary');
		}

		var encoded = new Buffer(iv, 'binary').toString('hex') + new Buffer(encrypted, 'binary').toString('hex');

		return encoded;
	} catch (ex) {
	  // handle error
	  // most likely, entropy sources are drained
	  console.error(ex);
	}
}
function decryptAES(keyhex, iv, encoded) { 	
	var combined = new Buffer(encoded, 'hex');		

	key = new Buffer(keyhex, "hex");
	
	// Create iv
	
	edata = combined.slice(16).toString('binary');

	// Decipher encrypted data
	var decipher = require('crypto').createDecipheriv('aes-256-cbc', key, iv);

	// UPDATE: crypto changed in v0.10
	// https://github.com/joyent/node/wiki/Api-changes-between-v0.8-and-v0.10 

	var nodev = process.version.match(/^v(\d+)\.(\d+)/);

	var decrypted, plaintext;
	if( nodev[1] === '0' && parseInt(nodev[2]) < 10) {  
		decrypted = decipher.update(edata, 'binary') + decipher.final('binary');    
		plaintext = new Buffer(decrypted, 'binary').toString('utf8');
	} else {
		plaintext = (decipher.update(edata, 'binary', 'utf8') + decipher.final('utf8'));
	}
	return plaintext;
}

function makeid() {
    return "8479768f48481eeb9c8304ce0a58481eeb9c8304ce0a5e3cb5e3cb58479768f4";
  }

module.exports.AESKeyCreator = makeid;
module.exports.encryptAES = encryptAES;
module.exports.decryptAES = decryptAES;