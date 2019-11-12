/* Holds information about the route and the layer, which has the handles for a given path */

module.exports = Route;
const methods = require('methods');
const flatten = require('array-flatten');
const Layer = require('./layer');

function Route(path) {
  this.path = path;
  this.stack = [];

  this.methods = {};
}

Route.prototype.dispatch = function dispatch(req, res, done) {

};

// Route also implements all the HTTP methods
methods.forEach(function(method) {
  Route.prototype[method] = function() {
    const handles = flatten(Array.prototype.slice.call(arguments));

    for (let i = 0; i < handles.length; i++) {
      let handle = handles[i];

      if (typeof handle !== 'function') {
        const type = toString.call(handle);
        const msg = 'Route.' + method + '() requires a callback function but got a ' + type;
        throw new Error(msg);
      }

      const layer = Layer('/', {}, handle);
      layer.method = method;

      this.methods[method] = true;
      this.stack.push(layer);
    }

    return this;
  }
});
