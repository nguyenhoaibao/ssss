const Joi = require('joi');
const PostController = require('../controllers/PostController');

module.exports = [
  {
    method: 'GET',
    path: '/posts/{id}',
    config: {
      handler: PostController.item,
      description: 'Get details by post {id}',
      tags: ['api'],
      validate: {
        params: {
          id: Joi.number().integer().positive()
        }
      }
    }
  }
];
