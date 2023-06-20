'use strict';
const log4js = require('log4js');
const jwt = require('jsonwebtoken');
const config = require('../../config/constants.json');
const logger = log4js.getLogger('auth');

const authenticate = (req, res, next) => {
    logger.debug('New req for %s', req.originalUrl);
    if (req.originalUrl.indexOf('user/login') >= 0 || req.originalUrl.indexOf('user/register') >= 0) {
        return next();
    }

    var token = req.body.token || req.token || req.headers.authorization;
    if(token){
        jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });
        } else {
            req.decoded = decoded;
            return next();
        }
    });
    } else {
        return res.status(401).send({ 
            success: false,
            message: 'No token provided.'
        });
    }
    
}

module.exports = {
    authenticate
}