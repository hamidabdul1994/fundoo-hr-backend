
/**
 * index.js
 *
 * Index Configuration setup is required to run your server.
 *
 * @author  Dilip <dilip.more@bridgelabz.com>
 * @license ICS
 * @version 1.0
 */
;var winston = require('winston')
    , dateFormat = require('dateformat')
    , clc = require('cli-color')
    , loadLocalConfig = require('./local')
    , loadProductionConfig = require('./production')
    , loadDevelopmentConfig = require('./development');

winston.emitErrs = true;

/**
 * @description Defines the color for console
 */
var consoleColorMap = {
      "log": clc.blue
    , "warn": clc.yellow
    , "error": clc.red.bold
    , "info": clc.cyan
};

/**
 * Apply the console color to the actual consoles
 * @description Adds the timestamp & colors to the console function
 */
["log", "warn", "error", "info"].forEach(function(method) {
    var oldMethod = console[method].bind(console);
    console[method] = function() {
        var res = [];
        for (var x in arguments)
            if (arguments.hasOwnProperty(x))
                res.push(arguments[x]);
        oldMethod.apply(
            console, [consoleColorMap[method](dateFormat(new Date(), "ddd, mmm d yyyy h:MM:ss TT Z")), consoleColorMap[method](method), ':']
            .concat(consoleColorMap[method](res.join(" ")))
        );
    };
});

/**
 * @description Combine all the require config files.
 *
 */
var config = {
      "production": loadProductionConfig
    , "development": loadDevelopmentConfig
    , "local": loadLocalConfig
}

/**
 * @exports : Exports the Config Environment based Configuration
 *
 */
exports.get = function get(env) {
    this.env = config[env] || config.local;
    this.ename = (this.env.name) ? this.env.name : '';
    console.log("Environment Set to:", this.ename);
    return this.env;
};
