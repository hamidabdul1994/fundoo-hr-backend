#!/usr/bin/env node

/*
 *  FundooHR Backend API.
 */
'use strict';

/*
 * Module dependencies
 */
var express = require('express'),
    dateFormat = require('dateformat'),
    cors = require('cors'),
    colors = require('colors/safe'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    jwt = require('jsonwebtoken'),
    db = require('./config/database/mongodb'),
    //routes = require('./routes'),
    //user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    //pipefile = require('./routes/pipefile'),
    swagger = require("swagger-node-express"),
    argv = require('minimist')(process.argv.slice(2)),
    fs = require("fs"),
    debug = require('debug')('njs'),
    //config = require('./config');
    expressValidator = require('express-validator'),
    config = require('./config/').get(process.env.NODE_ENV);

var error = console.error;
console.error = function () {
    error.apply(console, [dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT Z")].concat(" error :", (typeof arguments[0] != undefined) ? arguments[0] : arguments));
}
var log = console.log;
console.log = function () {
    log.apply(console, [dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT Z")].concat(" log   :", (typeof arguments[0] != undefined) ? arguments[0] : arguments));
}

var app = express();
var subpath = express();
app.set('database', config.database);
app.set('port', process.env.NODE_PORT || 3333);
app.set('host', process.env.NODE_IP || 'localhost');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(expressValidator());
//app.use("/",express.static("./public")); //Angular

app.use(morgan('common', {
    stream: fs.createWriteStream('./access.log', {
        flags: 'a'
    })
}));
app.use(morgan("dev"));
app.use(require("./controller/index"));

app.use("/api", subpath);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('dist'));
swagger.setAppHandler(subpath);

swagger.setApiInfo({
    title: "Fundoo HR API",
    description: "",
    termsOfServiceUrl: "",
    contact: "admin@bridgelabz.com",
    license: "",
    licenseUrl: ""
});
subpath.get('/', function (req, res) {
    res.sendfile(__dirname + '/dist/index.html');
});
swagger.configureSwaggerPaths('', 'api-docs', '');

var domain = 'localhost';
if (argv.domain !== undefined)
    domain = argv.domain;
else
    console.log('No --domain=xxx specified, taking default hostname "localhost".');

// var applicationUrl = 'http://' + domain + ':' + app.get('port');
var applicationUrl = 'http://' + domain;
swagger.configure(applicationUrl, '1.0.0');

/**
 * Launch server
 */
app.listen(app.get('port'), function () {
    debug('Application started on port %d', app.get('port'));
    console.log('Express server listening on port ' + app.get('port'));
});