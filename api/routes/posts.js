const Joi = require('joi');
const PostController = require('../controllers/PostController');
const postValidator = require('../validators/post');

module.exports = [
  {
    method: 'POST',
    path: '/posts',
    config: {
      handler: PostController.create,
      description: 'Create new post',
      tags: ['api'],
      validate: {
        payload: postValidator.createSchema()
      }
    }
  },
  {
    method: 'GET',
    path: '/posts',
    config: {
      handler: PostController.list,
      description: 'List posts',
      tags: ['api']
    }
  },
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
