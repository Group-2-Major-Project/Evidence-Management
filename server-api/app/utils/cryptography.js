// import { randomBytes, crypto.scryptSync, crypto.createCipheriv, crypto.createDecipheriv } from 'crypto';
const crypto = require('crypto')
var exports = module.exports = {};

const ALGORITHM = {
    // GCM is an authenticated encryption mode that not only provides confidentiality but also provides integrity in a secured way
    BLOCK_CIPHER: 'aes-256-gcm',

    // 128 bit auth tag is recommended for GCM
    AUTH_TAG_BYTE_LEN: 16,

    // NIST recommends 96 bits or 12 bytes IV for GCM to promote interoperability, efficiency, and simplicity of design
    IV_BYTE_LEN: 12,

    // Note: 256 (in algorithm name) is key size. Block size for AES is always 128
    KEY_BYTE_LEN: 32,

    // To prevent rainbow table attacks
    SALT_BYTE_LEN: 16
}

const getIV = crypto.randomBytes(ALGORITHM.IV_BYTE_LEN);
const getRandomKey = crypto.randomBytes(ALGORITHM.KEY_BYTE_LEN);

const getSalt = crypto.randomBytes(ALGORITHM.SALT_BYTE_LEN);

const getKeyFromPassword = (password, salt) => {
    return crypto.scryptSync(password, salt, ALGORITHM.KEY_BYTE_LEN);
}

/**
 *
Hardcoded for testing---*******************NEED TO CHANGE THIS LATER***************
*/
const key = getKeyFromPassword('mysecretpassword', 'salt')
// *****************************************

const encrypt = (messagetext) => {
    try {
        const iv = getIV;
        const cipher = crypto.createCipheriv(
            ALGORITHM.BLOCK_CIPHER, key, iv,
            { 'authTagLength': ALGORITHM.AUTH_TAG_BYTE_LEN });
        let encryptedMessage = cipher.update(messagetext);
        encryptedMessage = Buffer.concat([encryptedMessage, cipher.final()]);
        return Buffer.concat([iv, encryptedMessage, cipher.getAuthTag()]);
    } catch (error) {
        console.log(error);
    }

}

const decrypt = (ciphertext) => {
    try {
        const authTag = ciphertext.slice(-16);
        const iv = ciphertext.slice(0, 12);
        const encryptedMessage = ciphertext.slice(12, -16);
        const decipher = crypto.createDecipheriv(
            ALGORITHM.BLOCK_CIPHER, key, iv,
            { 'authTagLength': ALGORITHM.AUTH_TAG_BYTE_LEN });
        decipher.setAuthTag(authTag);
        let messagetext = decipher.update(encryptedMessage);
        messagetext = Buffer.concat([messagetext, decipher.final()]);
        return messagetext;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    encrypt,
    decrypt
}