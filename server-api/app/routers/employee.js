const express = require('express');
const router = express.Router();
const log4js = require('log4js');
const logger = log4js.getLogger('user');
const config = require('../../config/constants.json');
logger.level = config.logLevel;
const employeeService = require('../fabricGateway/employees');
const helper = require('../fabricOps/helper')

router.post('/add', async (req, res) => {
    try {
        response = await employeeService.add(req);
        return res.status(200).send(response);
    } catch (error) {
        return res.status(401).send(error.toString());
    }
});

router.post('/update', async (req, res) => {
    try {
        response = await employeeService.update(req);
        return res.status(200).send(response);
    } catch (error) {
        return res.status(401).send(error.toString());
    }
});

router.post('/getone', async (req, res) => {
    try {
        response = await employeeService.getOne(req);
        return res.status(200).send(response);
    } catch (error) {
        return res.status(401).send(error.toString());
    }
});

router.post('/deleterecord', async (req, res) => {
    try {
        response = await employeeService.deleteRecord(req);
        return res.status(200).send(response);
    } catch (error) {
        return res.status(401).send(error.toString());
    }
});

router.get('/getall', async (req, res) => {
    try {
        response = await employeeService.getAll(req);
        return res.status(200).send(response);
    } catch (error) {
        return res.status(401).send(error.toString());
    }
});

router.post('/addprivate', async (req, res) => {
    try {
        response = await employeeService.addPrivate(req);
        return res.status(200).send(response);
    } catch (error) {
        return res.status(401).send(error.toString());
    }
});

router.post('/getpvtdata', async (req, res) => {
    try {
        response = await employeeService.getPvtData(req);
        return res.status(200).send(response);
    } catch (error) {
        return res.status(401).send(error.toString());
    }
});

router.post('/getipfsfile', async (req, res) => {
    try {
        response = await employeeService.getIpfsFile(req);
        return res.status(200).send(response);
    } catch (error) {
        return res.status(401).send(error.toString());
    }
});


module.exports = router;

