/* Handle the routing logic */

const setPrototypeOf = require('setprototypeof');
const Route = require('./route');
const Layer = require('./layer');

const proto = module.exports = function(options) {
  const opts = options || {};

  function router(req, res, next) {
    router.handle(req, res, next);
  }

  setPrototypeOf(router, proto);

  /* Express specific */
  router.params = {};
  router._params = {};
  router.caseSensitive = opts.caseSensitive;
  router.mergeParams = opts.mergeParams;
  router.strict = opts.strict;
  // The stack is what keeps our routes inclined
  router.stack = [];

  return router;
}

proto.route = function route(path) {
  // Create route and layer
  const route = new Route(path);
  const layer = new Layer(path, {}, route.dispatch.bind(route));

  // Set route of layer to be equal to the route
  layer.route = route;

  // Push the data (route and layer) into the router's stack
  this.stack.push(layer);

  return route;
}

// Temporary hack to send some response from the router
proto.handle = function handle(req, res, out) {
  const self = this;
  const stack = self.stack;
  const layer = stack[0];
  const route = layer.route;

  route.stack[0].handle_request(req, res);
}