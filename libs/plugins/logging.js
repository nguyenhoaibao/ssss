const good = require('good');
const utils = require('../helpers/utils');

const LOG_STDOUT = utils.getEnv('LOG_STDOUT');
const LOG_FILE = utils.getEnv('LOG_FILE');
const LOG_FILE_PATH = utils.getEnv('LOG_FILE_PATH');

exports.register = function registerLoggingPlugin(server, options, next) {
  const logOptions = {
    reporters: {}
  };

  if (LOG_STDOUT === 'enabled') {
    logOptions.reporters.console = [
      {
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [
          {
            log: '*',
            error: '*'
          }
        ]
      },
      {
        module: 'good-console'
      },
      'stdout'
    ];
  }

  if (LOG_FILE === 'enabled' && LOG_FILE_PATH) {
    logOptions.reporters.file = [
      {
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [
          {
            log: 'error',
            error: '*'
          }
        ]
      },
      {
        module: 'good-squeeze',
        name: 'SafeJson'
      },
      {
        module: 'good-file',
        args: [LOG_FILE_PATH]
      }
    ];
  }

  if (!Object.keys(logOptions.reporters).length) {
    return next();
  }

  return server.register({
    register: good,
    options: logOptions
  }, (error) => {
    if (error) {
      return next(error);
    }

    return next();
  });
};

exports.register.attributes = {
  name: 'logging',
  version: '0.0.1',
  multiple: false
};
