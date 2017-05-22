const Joi = require('joi');
const CategoryController = require('../controllers/CategoryController');

const findCategoryById = function findCategoryById(request, reply) {
  const categoryId = request.params.id;
  const CategoryModel = request.getDb().getModel('Category');

  return CategoryModel.findById(categoryId)
    .then(category => reply(category))
    .catch((error) => {
      request.log('error', error);

      return reply(null);
    });
};

module.exports = [
  {
    method: 'GET',
    path: '/categories',
    config: {
      handler: CategoryController.list,
      description: 'List all categories',
      tags: ['api']
    }
  },
  {
    method: 'GET',
    path: '/categories/{id}/posts',
    config: {
      handler: CategoryController.posts,
      description: 'List posts by category {id}',
      tags: ['api'],
      validate: {
        params: {
          id: Joi.number().integer().positive()
        },
        query: {
          limit: Joi
            .number()
            .integer()
            .min(1)
            .max(20)
            .default(10),
          page: Joi
            .number()
            .integer()
            .min(1)
            .default(1)
        }
      },
      pre: [{
        method: findCategoryById,
        assign: 'category'
      }]
    }
  }
];
