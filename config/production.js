/**
 * production.js
 *
 * Procuction file is the final config for the live site. Do not change the content.
 *
 * @author  Dilip <dilip.more@bridgelabz.com>
 * @license ICS
 * @version 1.0
 */
;var winston = require('winston');

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
    , "database": 'mongodb://<user>:<pwd>@mongodb.host.net:27017/db'
    , "twitter": {
          "consumerKey": 'consumer Key'
        , "consumerSecret": 'consumer Secret'
        , "callbackURL": 'http://yoururl.com/auth/twitter/callback'
    }
    , "logger": new winston.Logger({
        "transports": [
            new winston.transports.File({
                  "filename": '/var/log/server.log'
                , "level": 'error'
            })
            , new winston.transports.Console({
                  "level": 'debug'
                , "handleExceptions": true
                , "json": false
                , "colorize": true
            })
        ]
        , "exitOnError": false
    })
};
