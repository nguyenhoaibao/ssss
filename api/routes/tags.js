const Joi = require('joi');
const TagController = require('../controllers/TagController');

const findTagById = function findTagById(request, reply) {
  const tagId = request.params.id;
  const TagModel = request.getDb().getModel('Tag');

  return TagModel.findById(tagId)
    .then(tag => reply(tag))
    .catch((error) => {
      request.log('error', error);

      return reply(null);
    });
};

module.exports = [
  {
    method: 'GET',
    path: '/tags',
    config: {
      handler: TagController.list,
      description: 'List all tags',
      tags: ['api']
    }
  },
  {
    method: 'GET',
    path: '/tags/{id}/posts',
    config: {
      handler: TagController.posts,
      description: 'List posts by tag {id}',
      tags: ['api'],
      validate: {
        params: {
          id: Joi.number().integer().positive()
        }
      },
      pre: [{
        method: findTagById,
        assign: 'tag'
      }]
    }
  }
];
