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
var swaggerUiMiddleware = require('swagger-ui-middleware');

var loadSwagger = function(app){
    swaggerUiMiddleware.hostUI(app, {
        path: '/swagger/api/',
        overrides: __dirname + '/lib/swagger-ui/'
    });
}
module.exports = function(app) {
    return loadSwagger(app);
};
