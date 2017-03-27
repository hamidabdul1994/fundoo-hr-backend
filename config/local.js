/**
 * local.js
 *
 * Local file is the setup required for running the app locally
 *
 * @author  Dilip <dilip.more@bridgelabz.com>
 * @license ICS
 * @version 1.0
 */
;var winston = require('winston');

/**
 * @exports : Exports local Config Environment based Configuration
 *
 */
module.exports = {
      "name": 'local'
    , "host": 'localhost'
    , "port": process.env.NODE_PORT || 3030
    , "session": {
          "key": 'the.express.session.id'
        , "secret": 'something.super.secret'
    }
    , "database": 'mongodb://127.0.0.1:27017/fundoohr'
    , "twitter": {
          "consumerKey": 'consumer Key'
        , "consumerSecret": 'consumer Secret'
        , "callbackURL": 'http://127.0.0.1:3000/auth/twitter/callback'
    }
    , "logger": new winston.Logger({
        "transports": [
            new winston.transports.File({
                  "level": 'info'
                , "filename": './logs/all-logs.log'
                , "handleExceptions": true
                , "json": true
                , "maxsize": 5242880 //5MB
                , "maxFiles": 5
                , "colorize": false
            })
            , new winston.transports.Console({
                  "level": 'debug,error'
                , "handleExceptions": true
                , "json": true
                , "colorize": true
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
