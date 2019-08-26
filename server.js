/*
 * Remote cron service
 */

process.env.TZ = 'UTC'; //use UTC for all dates

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var express = require('express');
var logger = require('morgan');

var port = process.env.COHORTON_PORT || '7878';
var ipaddr = process.env.COHORTON_IP || '127.0.0.1';

var app = (module.exports = express());
app.disable('x-powered-by');

// configure mongodb
var dbUrl;
if (app.get('env') === 'development') {
    dbUrl = 'mongodb://localhost/cohorton';
    app.use(logger('dev'));
} else {
    dbUrl = process.env.COHORTON_MONGODB_URL;
}

mongoose.connect(dbUrl, function(err) {
    if (err) {
        console.log('MongoDB error:' + err);
        process.exit();
    }
});
mongoose.connection.on('error', function(err) {
    console.error('MongoDB error: ' + err.message);
    console.error('Make sure a mongoDB server is running and accessible by this application');
    process.exit();
});

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

// Routes
app.use('/', require('./app/api'));

app.listen(port, ipaddr, function() {
    console.log('%s: Node server started on %s:%d ...', Date(Date.now()), ipaddr, port);
});
