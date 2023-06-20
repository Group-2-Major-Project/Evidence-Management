const bcrypt = require('bcryptjs');

const hashPassword = (pwdStr) => {
    let saltRound = 12;
    const hashedPwd = bcrypt.hashSync(pwdStr, saltRound);
    return hashedPwd;
}

module.exports = {
    hashPassword
}