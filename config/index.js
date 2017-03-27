var winston = require('winston'),
    dateFormat = require('dateformat'),
    clc = require('cli-color');
winston.emitErrs = true;

var mapping = {
    log: clc.blue,
    warn: clc.yellow,
    error: clc.red.bold,
    info: clc.cyan
};

["log", "warn", "error", "info"].forEach(function(method) {
    var oldMethod = console[method].bind(console);
    console[method] = function() {
        oldMethod.apply(
            console, [mapping[method](dateFormat(new Date(), "ddd, mmm d yyyy h:MM:ss TT Z")), mapping[method](method), ':']
            .concat(mapping[method](arguments[0]))
        );
    };
});

var config = {
    production: {
        host: '',
        port: 80,
        session: {
            key: 'the.express.session.id',
            secret: 'something.super.secret'
        },
        database: 'mongodb://<user>:<pwd>@mongodb.host.net:27017/db',
        twitter: {
            consumerKey: 'consumer Key',
            consumerSecret: 'consumer Secret',
            callbackURL: 'http://yoururl.com/auth/twitter/callback'
        },
        logger: new winston.Logger({
            transports: [
                new winston.transports.File({
                    filename: '/var/log/server.log',
                    level: 'error'
                }),
                new winston.transports.Console({
                    level: 'debug',
                    handleExceptions: true,
                    json: false,
                    colorize: true
                })
            ],
            exitOnError: false
        })
    },
    development: {
        host: 'localhost',
        port: process.env.NODE_PORT || 3030,
        session: {
            key: 'the.express.session.id',
            secret: 'something.super.secret'
        },
        database: 'mongodb://127.0.0.1:27017/fundoohr',
        twitter: {
            consumerKey: 'consumer Key',
            consumerSecret: 'consumer Secret',
            callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'
        },
        logger: new winston.Logger({
            transports: [
                new winston.transports.File({
                    level: 'info',
                    filename: './logs/all-logs.log',
                    handleExceptions: true,
                    json: true,
                    maxsize: 5242880, //5MB
                    maxFiles: 5,
                    colorize: false
                }),
                new winston.transports.Console({
                    level: 'debug, error',
                    handleExceptions: true,
                    json: true,
                    colorize: true
                })
            ],
            exitOnError: false,
            emitErrs: true
        }),
        stream: {
            write: function(message, encoding) {
                this.logger.info(message);
            }
        }
    },
    default: {
        host: 'localhost',
        port: process.env.NODE_PORT || 3030,
        session: {
            key: 'the.express.session.id',
            secret: 'something.super.secret'
        },
        database: 'mongodb://127.0.0.1:27017/fundoohr',
        twitter: {
            consumerKey: 'consumer Key',
            consumerSecret: 'consumer Secret',
            callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'
        },
        logger: new winston.Logger({
            transports: [
                new winston.transports.File({
                    level: 'info',
                    filename: './logs/all-logs.log',
                    handleExceptions: true,
                    json: true,
                    maxsize: 5242880, //5MB
                    maxFiles: 5,
                    colorize: false
                }),
                new winston.transports.Console({
                    level: 'debug,error',
                    handleExceptions: true,
                    json: true,
                    colorize: true
                })
            ],
            exitOnError: false,
            emitErrs: true
        }),
        stream: {
            write: function(message, encoding) {
                this.logger.info(message);
            }
        }
    }
}

exports.get = function get(env) {
    return config[env] || config.default;
}
