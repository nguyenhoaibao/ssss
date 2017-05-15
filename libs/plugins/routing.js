const routes = require('../../api/routes');

exports.register = function registerRoutingPlugin(server, options, next) {
  server.route(routes);

  next();
};

exports.register.attributes = {
  name: 'routing',
  version: '0.0.1',
  multiple: false
};
