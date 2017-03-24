/**
 * Module dependencies.
 */

var express = require('express');
var argv = require('minimist')(process.argv.slice(2));
var swagger = require("swagger-node-express");
var bodyParser = require( 'body-parser' );

var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var pipefile = require('./routes/pipefile');

var app = express();
var subpath = express();

app.use(bodyParser());
app.use("/v1", subpath);

swagger.setAppHandler(subpath);


swagger.setApiInfo({
    title: "Fundoo HR API",
    description: "",
    termsOfServiceUrl: "",
    contact: "admin@bridgelabz.com",
    license: "",
    licenseUrl: ""
});

// all environments
app.set('port', process.env.PORT || 3060);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
//app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('dist'));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/pipefile', pipefile.get);

subpath.get('/', function (req, res) {
    res.sendfile(__dirname + '/dist/index.html');
});

swagger.configureSwaggerPaths('', 'api-docs', '');

var domain = 'localhost';
if(argv.domain !== undefined)
    domain = argv.domain;
else
    console.log('No --domain=xxx specified, taking default hostname "localhost".');

// var applicationUrl = 'http://' + domain + ':' + app.get('port');
var applicationUrl = 'http://' + domain;
swagger.configure(applicationUrl, '1.0.0');

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
=======
var http = require('http'),
    util = require('util'),
    mu = require('mu2');
// var fs = require('fs');
var pdf = require('html-pdf');
var mu2Express = require("mu2express");
var express = require("express");
var app = express();
app.engine('mustache', mu2Express.engine);
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');
var info = {
        name: 'BridgeLabz',
        description: 'Some Data ABout BridgeLabz',
        terms: [{
            name: 't1',
            description: 'Some Data ABout BridgeLabz 1'
        }, {
            name: 't2',
            description: 'Some Data ABout BridgeLabz 2'
        }, ]
    }

app.get('/', function(req, res) {
    //Renders the Views/index.mustache file with the view {'test': 'somevalue'} using the mu2 engine
    res.render('index.html', info);
    });
app.listen(8080);
var options = {
    format: 'Letter'
};

// mu.root = __dirname + '/templates';

    // http.createServer(function (req, res) {

/*var stream = mu.compileAndRender('index.html', info);
stream.on("data", function(data) {
    console.log(data.toString());
    pdf.create(data.toString(), options).toFile('./attendance/attendance.pdf', function(err, result) {
        if (err) {
            console.log("err",err);
        } else {
            console.log("Done");
        }
    });
});*/
// }).listen(8000);
