'use-strict';

var mongoose = require('mongoose'),
  autoIncrement = require('mongoose-auto-increment'),
  dbURI = 'mongodb://localhost/fundoohr1';

mongoose.Promise = global.Promise; // Fix for error : Mongoose: mpromise (mongoose's default promise library) is deprecated, plug in your own promise library instead: http://mongoosejs.com/docs/promises.html

// mongoose.connect('127.0.0.1','test');
var connection =mongoose.connect(dbURI, function (err) {
  if (err) console.log(err);
});
autoIncrement.initialize(connection);     //initialize the plugin auto increament
mongoose.connection.on("connected", function () {
  console.log("Mongoose connected to: " + dbURI);
});

mongoose.connection.on("error", function () {
  console.error("Mongoose Error");
  console.log("Mongoose error");
});

mongoose.connection.on('disconnect', function (err) {
  console.log('Mongoose disconnect', err);
});

mongoose.connection.on("disconnected", function () {
  console.log("Mongoose disconnected");
  mongoose.connection.close();
});

mongoose.connection.on("open", function () {
  console.log("Mongoose connection open");
});

mongoose.connection.on('parseError', function (err) {
  console.log('Mongoose parseError:', err);
});

mongoose.connection.on('timeout', function (err) {
  console.log('Mongoose timeout', err);
});

process.on("SIGINT", function () {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected on app termination');
    process.exit(0);
  });
});

module.exports = mongoose;
