/**
 * developement.js
 *
 * Developement file is the default setup expected to have on a localmachine to work with the Production config
 *
 * @author  Dilip <dilip.more@bridgelabz.com>
 * @license ICS
 * @version 1.0
 */
 ;var  winston = require('winston')
     , moment = require('moment');

/**
 * @exports : Exports developement Config Environment based Configuration
 *
 */
module.exports = {
      "name": 'Development'
    , "host": 'localhost'
    , "port": process.env.NODE_PORT || 3030
    , "session": {
          "key": 'the.express.session.id'
        , "secret": 'something.super.secret'
    }
    , 'ttl': 3600000 //1 hour
    , 'resetTokenExpiresMinutes': 20 //20 minutes later
    , "swagger": true
    , "database": 'mongodb://127.0.0.1:27017/fundoohr'
    , "logger": new winston.Logger({
        "transports": [
            new winston.transports.File({
                  "level": 'error'
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
                  "level": 'info,varbose,debug,silly'
                , "handleExceptions": true
                , "json": true
                , "colorize": true
                , "prettyPrint": true
                , "humanReadableUnhandledException": true
                , "timestamp": function() {
                    return moment.utc().format();
                }
            })
        ]
        , "exitOnError": false
        , "emitErrs": true
    })
    , "stream": {
        write: function(message, encoding) {
            this.logger.info(message);
        }
    }
};
