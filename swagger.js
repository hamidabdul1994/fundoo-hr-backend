#!/usr/bin/env node

/*
 * fundooHR-Backend
 * Copyright(c) 2017 Bridgelabz <admin@bridgelabz.com>
 * ISC Licensed
 */
'use strict';

/*
 * Module dependencies
 */
var express = require('express'),
    cors = require('cors'),
    swagger = require("swagger-node-express");
    config = require('./config/').get(process.env.NODE_ENV),

var app = express();
app.set('database', config.database);
app.set('port', config.port);
app.set('host', config.host);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var subpath = express();
app.use("/api", subpath);
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
subpath.get('/', function(request, response) {
    response.sendfile(__dirname + '/dist/index.html');
});
swagger.configureSwaggerPaths('', 'api-docs', '');
swagger.configure(config.host, '1.0.0');

/**
 * Launch server
 */
app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
