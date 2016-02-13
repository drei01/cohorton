/*
 * Remote cron service
 */

process.env.TZ = 'UTC';//use UTC for all dates

var fs     = require('fs');
var	mongoose = require('mongoose');
var	bodyParser = require('body-parser');
var	express  = require('express');
var expressValidator = require('express-validator');
var	logger = require('morgan');
	
var	port    = process.env.OPENSHIFT_NODEJS_PORT || '7878';
var    ipaddr  = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var app = module.exports = express();

// configure mongodb
var dbUrl;
if (app.get('env') === 'development') {
	dbUrl = 'mongodb://localhost/cohorton';
} else {
	dbUrl = process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME;
}

 mongoose.connect(dbUrl, function(err) {
	if (err) {
		console.log("MongoDB error:" + err);
		process.exit();
	}
});
mongoose.connection.on('error', function (err) {
  console.error('MongoDB error: ' + err.message);
  console.error('Make sure a mongoDB server is running and accessible by this application');
  process.exit();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(expressValidator([]));

// Routes
app.use('/', require('./app/api'));

app.listen(port, ipaddr, function(){
  console.log('%s: Node server started on %s:%d ...', Date(Date.now()), ipaddr, port);
});