const express = require('express');
const router = express.Router();
const log4js = require('log4js');
const logger = log4js.getLogger('user');
const config = require('../../config/constants.json');
logger.level = config.logLevel;
const userService = require('../fabricGateway/users');
const helper = require('../fabricOps/helper')

router.post('/register', async (req, res) => {
    try {
        const username = req.body.userID;
        const password = req.body.password;
        const orgName = req.body.org;

        await helper.enrollAdmin(orgName);
        let user = await helper.registerAndEnrollUser(username, password, orgName);
        if (!user) {
            let errMsg = `A user already exists with the username ${username}`;
            return res.status(409).send(errMsg);
        }
        await userService.register(req.body);
        return res.status(200).send(user);
    } catch (error) {
        if (error.toString().includes('already exists')) {
		    return res.status(409).send(error.toString());
        } else {
            return res.status(401).send(error.toString());
        }
    }
});

router.post('/login', async (req, res) => {
    try {
        const username = req.body.userID;
        const password = req.body.password;
        const orgName = req.body.org;

        const user = await helper.getRegisteredUser(username, orgName);
        if(!user) {
            return res.status(401).send("Unable to find the user");
        }
        let userResponse = await userService.authenticateUser(username, password, orgName);
        return res.status(200).send(userResponse);
    } catch (error) {
        return res.status(401).send(error.toString());
    }
});

module.exports = router;

