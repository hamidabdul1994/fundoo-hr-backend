// var _ = require("lodash");
// var defaults = require("./default.js");
// var config = require("./" + (process.env.NODE_ENV || "development") + ".js");
// module.exports = _.merge({}, defaults, config);

var config = {
    production: {
        host: 'domain.com',
        port: 3030,
        session: {
            key: 'the.express.session.id',
            secret: 'something.super.secret'
        },
        database: 'mongodb://<user>:<pwd>@apollo.modulusmongo.net:27017/db',
        twitter: {
            consumerKey: 'consumer Key',
            consumerSecret: 'consumer Secret',
            callbackURL: 'http://yoururl.com/auth/twitter/callback'
        }
    },
    development: {
        host: 'localhost',
        port: 3030,
        session: {
            key: 'the.express.session.id',
            secret: 'something.super.secret'
        },
        database: 'mongodb://127.0.0.1:27017/fundoohr',
        twitter: {
            consumerKey: 'consumer Key',
            consumerSecret: 'consumer Secret',
            callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'
        }
    },
    default: {
        host: 'localhost',
        port: 3030,
        session: {
            key: 'the.express.session.id',
            secret: 'something.super.secret'
        },
        database: 'mongodb://127.0.0.1:27017/fundoohr',
        twitter: {
            consumerKey: 'consumer Key',
            consumerSecret: 'consumer Secret',
            callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'
        }
    }
}


exports.get = function get(env) {
    return config[env] || config.default;
}
