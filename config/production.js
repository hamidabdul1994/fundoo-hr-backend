/**
 * production.js
 *
 * Procuction file is the final config for the live site. Do not change the content.
 *
 * @author  Dilip <dilip.more@bridgelabz.com>
 * @license ICS
 * @version 1.0
 */
;var  winston = require('winston')
    , moment = require('moment');

/**
 * @exports : Exports Production (Live) Config Environment based Configuration
 *
 */
module.exports = {
      "name": 'Production'
    , "host": ''
    , "port": 80
    , "session": {
          "key": 'the.express.session.id'
        , "secret": 'something.super.secret'
    }
    , "swagger": false
    , "database": 'mongodb://<user>:<pwd>@mongodb.host.net:27017/db'
    , "logger": new winston.Logger({
        "transports": [
            new winston.transports.File({
                  "level": 'error,warn'
                , "filename": './logs/all-logs.log'
                , "handleExceptions": true
                , "json": true
                , "maxsize": 5242880 //5MB
                , "maxFiles": 5
                , "colorize": false
                , "prettyPrint": true
                , "zippedArchive": true
                , "timestamp": function() {
                  return moment.utc().format();
                }
            })
            , new winston.transports.Console({
                  "level": 'info'
                , "handleExceptions": true
                , "json": true
                , "colorize": true
            })
        ]
        , "exitOnError": false
    })
};
