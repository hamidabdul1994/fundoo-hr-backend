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

module.exports = function(app) {
    return require('./swagger')(app);
};
