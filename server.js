#!/usr/bin/env node

/**
 * FundooHR-Backend
 *
 * @author  Dilip <dilip.more@bridgelabz.com>
 * @license ISC Licensed
 * @version 1.0
 *
 * Copyright(c) 2017 Bridgelabz <admin@bridgelabz.com>
 */
;
'use strict';

/*
 * Module dependencies
 */
var express = require('express'),
    compression = require('compression'),
    dateFormat = require('dateformat'),
    cors = require('cors'),
    colors = require('colors/safe'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    session = require('cookie-session'),
    jwt = require('jsonwebtoken'),
    /*OLD Implementation*/
    join = require('path').join,
    passport = require('passport'),
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
    expressValidator = require('express-validator'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    config = require('./config/').get(process.env.NODE_ENV);

var User = require('./model/userSchema');


/**
 * @description Winston Logger derived from the config
 */
var logger = config.logger;

var app = express(); // console.log(app.get('env'));
app.set('database', config.database);
app.set('port', config.port);
app.set('host', config.host);

app.use(compression());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(session({
    keys: ['secretkey1', 'secretkey2', '...']
}));
app.set('view cache', true); //Which ever template engine you use, always ensure the view cache is enabled:

// Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Configure passport-local to use account model for authentication
passport.use(new LocalStrategy(User.User.authenticate()));

passport.serializeUser(User.User.serializeUser());
passport.deserializeUser(User.User.deserializeUser());

app.use(expressValidator());
//app.use("/",express.static("./public")); //Angular

app.use(morgan("dev"));
app.use(require("./controller/index"));

app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

var swaggerUiMiddleware = require('swagger-ui-middleware');
swaggerUiMiddleware.hostUI(app, {
    path: '/swagger/api/',
    overrides: __dirname + '/lib/swagger-ui/'
});
/**
 * Launch server
 */
app.listen(app.get('port'), function() {
    debug('Application started on port %d', app.get('port'));
    console.log('Express server listening on port ' + app.get('port'));
});
