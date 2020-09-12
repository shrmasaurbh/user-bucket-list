global.BASEPATH   = __dirname;
global.CONFIG     = require('./src/config/config');
global.CONSTANT   = require('./src/helpers/constants');

const express     = require('express');
const morgan      = require('morgan');
const bodyParser  = require('body-parser');
const compress 		= require('compression');
const cors        = require('cors');
const winston 		= require('winston');

const router      = require('./src/routes');
const connection  = require('./src/config/connections');
const apiResp     = require(BASEPATH+'/src/helpers/apiResponse');

var useragent = require('express-useragent');
const expressip = require('express-ip');
 
 
/**
 * Express instance
 * @public
 */
const app = express();

connection.sequelize.authenticate().then(() => {
  winston.info('Mysql connected')
    console.log('Connected to SQL database:', CONFIG.mysqldb_name);
})
.catch(err => {
    console.error('error connecting: ' + err.stack);
    winston.error(err)
    // process.exit(1);
    console.error('Unable to connect to SQL database:',CONFIG.mysqldb_name, err);
});

app.use(compress())
app.use(useragent.express());
app.use(expressip().getIpInfoMiddleware);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
    console.log("requested api : -", req.originalUrl, ",type : -", req.method);
    next();
})
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")
  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }
  next();
});

app.use('/api', router);

// catch 404 and forward to error handler
// throw 404 if URL not found
app.all("*", function(req, res,next) {
  console.log(req.originalUrl)
  const error = new Error("URL not found : "+req.originalUrl);
  error.status = 404;
  next(error);
	// return apiResponse.notFoundResponse(res, "Page not found");
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log("err from the app.js",err)
  res.locals.message = err.message;

  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // add this line to include winston logging
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
  apiResp.apiErr( req, res, 400, err);

});

app.use(bodyParser.json());


//This is here to handle all the uncaught promise rejections
process.on('unhandledRejection', error => {
    console.error('--------------------------------');
    console.error('Uncaught Error    => ', error);
});

module.exports = app;

