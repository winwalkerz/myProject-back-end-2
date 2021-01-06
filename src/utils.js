
const crypto = require('crypto');
const encryptKey = process.env.ENCRYPT_KEY

class Utils {

    constructor(){

    }

    validateEmail(email){
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    encryptPassword(password){
        return crypto.createHash('sha256').update(`${encryptKey}${password}`).digest('hex');
    }

}

module.exports = Utils