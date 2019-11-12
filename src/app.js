/* Main functions like get, use, etc. reside */

const methods = require('methods');
const http = require('http');
const Router = require('./router');
const slice = Array.prototype.slice;

const app = exports = module.exports = {};

app.init = function () {
  this.cache = {};
  this.engines = {};
  this.settings = {};

  // For holding the application router
  this._router = undefined;
}

app.set = function set(setting, val) {
  this.settings[setting] = val;

  switch (setting) {
    case 'etag':
      this.set('etag fn', "");
      break;
    case 'query parser':
      this.set('query parser fn', "");
      break;
    case 'trust proxy':
      this.set('trust proxy fn', "");
      break;
  }

  return this;
}

app.enabled = function enabled(setting) {
  return Boolean(this.set(setting));
}

// Creates new Router if one doesn't already exist
app.lazyrouter = function lazyrouter() {
  if (!this._router) {
    this._router = new Router({});
  }
}

// The listen function creates the HTTP server via node module 'http'. It then starts the server
app.listen = function listen() {
  const server = http.createServer(this);
  return server.listen.apply(server, arguments);
}

app.handle = function handle(req, res, callback) {
  const router = this._router;

  router.handle(req, res);
}

// Implement HTTP methods
methods.forEach(function(method) {
  app[method] = function(path) {
    // For this application, we are going to require a router
    this.lazyrouter();

    const route = this._router.route(path);

    route[method].apply(route, slice.call(arguments, 1));
    return this;
  }
});
