#!/usr/bin/env node

/**
 * fundooHR-Backend Swagger API
 * @author  Dilip <dilip.more@bridgelabz.com>
 * @license ICS
 * @version 1.0
 */
'use strict';

/*
 * Module dependencies
 */
var express = require('express'),
    cors = require('cors'),
    swagger = require("swagger-node-express");

var subpath = express.Router();
var app = express();

var swaggerUI = function(request, response, next) {
    // app.use("/api", subpath);
    // var subpath = express();
    // app.use("/api", subpath);
    // app.use(express.static('dist'));
    // swagger.setAppHandler(subpath);
    // swagger.setApiInfo({
    //     title: "Fundoo HR API",
    //     description: "",
    //     termsOfServiceUrl: "",
    //     contact: "admin@bridgelabz.com",
    //     license: "",
    //     licenseUrl: ""
    // });
    // subpath.get('/', function(req, res) {
    //     res.sendfile(__dirname + '/dist/index.html');
    // });
    // swagger.configureSwaggerPaths('', 'api-docs', '');
    // swagger.configure('http://' + app.get('domainURL'), '1.0.0');
};

module.exports = function(config) {
    if (typeof config.swagger !== undefined) {
        if (config.swagger) {
            app.set('domainURL', config.domainURL);
            return swaggerUI();
        }
    }
    return function(){};
};
