var express      = require('express');
var favicon      = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var _            = require('lodash');
var fs           = require('fs-extra');
var Xray         = require('x-ray');
var basicAuth    = require('basic-auth-connect');
var proxy = require('express-http-proxy');

var config = require(__dirname + '/lib/config');
var router = express.Router();

var app = express();
if (process.env.BASIC_AUTH_USER && process.env.BASIC_AUTH_PASSWORD) {
  app.use(basicAuth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD));
}
app.set('config', config);
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use(config.app.urlbase, router);

// dangerous settings, needed to see insecure https site
if (config.app.insecure) {process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
   console.log('Running in insecure mode')
}
//


//proxying route
app.use('/pxy/:id/', proxy( function(req){
  srv=config.services[req.params.id-1].url
  //console.log('req: ' +srv); //debug mode
  return srv},
  { memoizeHost: false
  })
);

/*
// try to use the host header in request
proxyReqOptDecorator: { headers:{host: function(req){
  srv=config.services[req.params.id-1].url.split(':')[0]
  return srv} }}

*/

// set local variables
app.locals.title    = config.app.title;
app.locals.port     = config.app.port;
app.locals.urlbase  = config.app.urlbase;
app.locals.proxyall = config.app.proxyall;
app.locals.services = config.services;


/*
 * GET index
 */
router.get('/', function(req, res, next) {

  var enabledServices = _.filter(res.app.locals.services, function(item) {
    return (item.url !== undefined && item.url !== '');
  });

  res.render('index', {
    title: res.app.locals.title,
    enabledServices: _.sortBy(enabledServices, 'sort'),
    Services: _.sortBy(res.app.locals.services, 'sort')
  });
});

module.exports = app;
