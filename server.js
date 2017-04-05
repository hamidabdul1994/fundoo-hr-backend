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
var fs = require("fs"),
    http = require('http'),
    path = require('path'),
    cors = require('cors'),
    join = require('path').join,
    express = require('express'),
    jwt = require('jsonwebtoken'),
    passport = require('passport'),
    colors = require('colors/safe'),
    debug = require('debug')('njs'),
    dateFormat = require('dateformat'),
    session = require('cookie-session'),
    bodyParser = require('body-parser'),
    compression = require('compression'),
    cookieParser = require('cookie-parser'),
    db = require('./config/database/mongodb'),
    swagger = require("swagger-node-express"),
    argv = require('minimist')(process.argv.slice(2)),
    expressValidator = require('express-validator'),
    LocalStrategy = require('passport-local').Strategy,
    config = require('./config/').get(process.env.NODE_ENV);
    /*OLD Implementation*/
    //routes = require('./routes'),
    //user = require('./routes/user'),
    //pipefile = require('./routes/pipefile'),

var User = require('./model/').User;
//require('./model/userSchema').get(config);

/**
 * @description Winston Logger derived from the config
 */
var logger = config.logger;

var app = express(); // console.log(app.get('env'));
app.set('database', config.database);
app.set('port', config.port);
app.set('host', config.host);

//app.use(compression());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
//app.use(cookieParser());
app.use(session({
    keys: ['secretkey1', 'secretkey2', '...']
}));
//app.set('view cache', true); //Which ever template engine you use, always ensure the view cache is enabled:

// Configure passport middleware
//app.use(express.methodOverride());
app.use(passport.initialize());
app.use(passport.session());
// Configure passport-local to use account model for authentication
passport.use(new LocalStrategy(User.User.authenticate()));
passport.serializeUser(User.User.serializeUser());
passport.deserializeUser(User.User.deserializeUser());
app.use(expressValidator());

app.use(require("./controller/index"));
//require(__dirname +'/routes/routes')(app, passport);

/**
 * @description Loading the tools, libraries required only in dev & local & not in production
 */
if (app.get('env') !== 'production' ) {
    //require('./lib/')(app);
}
/**
 * Launch server
 */
app.listen(app.get('port'), function() {
    debug('Application started on port %d', app.get('port'));
    console.log('Express server listening on port ' + app.get('port'));
});
