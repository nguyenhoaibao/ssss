const CategoryController = require('../controllers/CategoryController');

module.exports = [
  {
    method: 'GET',
    path: '/categories',
    config: {
      handler: CategoryController.list,
      description: 'List all categories',
      tags: ['api']
    }
  }
];
