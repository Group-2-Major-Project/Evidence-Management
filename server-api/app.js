'use strict';
const log4js = require('log4js');
const logger = log4js.getLogger('Hospital-sample');
const bodyParser = require('body-parser');
const http = require('http')
const express = require('express')
const app = express();
const fileupload = require("express-fileupload");
const cors = require('cors');
const config = require('./config/constants')
const auth = require('./app/routers/auth');
const host = process.env.HOST || config.host;
const port = process.env.PORT || config.port;

const helper = require('./app/fabricOps/helper');
const user = require('./app/routers/user');
const employee = require('./app/routers/employee');

app.options('*', cors());
app.use(cors());
app.use(fileupload());
app.use(express.static("files"));
app.use(bodyParser.json());
// app.use(bodyParser.json({limit: "50mb"}));
// app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

app.use(auth.authenticate);

app.use("/user", user)
app.use("/employee", employee)

// Error handling
app.use((req, res) => res.status(404).send("Router not found"))

var server = http.createServer(app).listen(port, async () => {
    // Admi default registration is commented as to simulate all organizations in the same localhost

    // await Promise.all([helper.enrollAdmin(config.orgName)]).then((result) => {
    //     logger.info('Successfully enrolled admin users');
    // }, (err) => {
    //     logger.error('Failed to enroll admin users', err);
    // });
    console.log(`Server started on ${port}`)
});
logger.info('****************** SERVER STARTED ************************');
logger.info('***************  http://%s:%s  ******************', host, port);
server.timeout = 240000;

