/* Contains the path and necessary function reference to execute when a path matches the given request */

module.exports = Layer; 

function Layer(path, options, fn) {
  if (!(this instanceof Layer)) {
    return new Layer(path, options, fn);
  }

  this.handle = fn;
  this.name = fn.name || '<anonymous>';
  this.params = undefined;
  this.path = undefined;
}

Layer.prototype.match = function match(path) {
  return this.route.path === path;
}

Layer.prototype.handle_request = function handle(req, res, next) {
  const fn = this.handle;

  try {
    fn(req, res, next);
  } catch (err) {
    console.log(err);
  }
}
