const query = require('../fabricOps/query');
const helper = require('../fabricOps/helper');
const invoke = require('../fabricOps/invoke');
const lodash = require('lodash');
const bcrypt = require('bcryptjs');
const config = require('../../config/constants');
const util = require('../utils/util');
const moment = require('moment');
const log4js = require('log4js');
const logger = log4js.getLogger('users');
const jwt = require('jsonwebtoken');

const authenticateUser = async (userName, password, org) => {
    let payload = [userName];
    try {
        let resp = await query.queryChaincode(config.channelName, config.chaincodeName, payload, "GetUserDetails", userName, org);
        let chainData;

        if (resp && resp.status == helper.ledgerOpsStatus.success) {
            chainData = resp.objectBytes ? JSON.parse(resp.objectBytes) : null;
        } else {
            throw new Error(JSON.parse(resp.description));
        }
        let pwdHash = lodash.get(chainData, 'password');
        if (!bcrypt.compareSync(password, pwdHash)) {
            throw new Error('Invalid password.')
        }
        let token = generateJwtToken(userName, org);
        const ret = JSON.stringify({username:userName, org:org, jwt:token});
        return (ret);

    } catch (err) {
        console.log('EERORO')
        throw err;
    }
}

const register = async (req_body) => {
    try {
        let username = req_body.userID;
        let password = req_body.password;
        let orgName = req_body.org;
        
        req_body.password = util.hashPassword(password);
        req_body.timeStamp = moment.utc().format(config.dateFormat);
        await invoke.invokeTransaction(config.channelName, config.chaincodeName, "CreateUser", req_body, username, orgName);
        return;
    } catch (error) {
        throw error;
    }
}

const generateJwtToken = (userName, org) => {
    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + parseInt(config.jwt_expiretime),
        username: userName,
        orgname: org
    }, config.secret);
}

const respObj = (userName, token) => {
    return ({
        accessToken: token,
        username: userName,
    });
}

module.exports = {
    authenticateUser,
    register,
    generateJwtToken,
    respObj
}
