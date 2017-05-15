const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const utils = require('../helpers/utils');

exports.register = function registerSwaggerDocPlugin(server, options, next) {
  if (!utils.isSwaggerDocEnabled()) {
    return next();
  }

  const title = 'Spout360 API Documentation';

  return server.register([
    Inert,
    Vision,
    {
      register: HapiSwagger,
      options: {
        info: {
          title
        }
      }
    }
  ], (error) => {
    if (error) {
      return next(error);
    }

    return next();
  });
};

exports.register.attributes = {
  name: 'doc',
  version: '0.0.1',
  multiple: false
};
