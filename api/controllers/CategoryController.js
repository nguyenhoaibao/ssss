const Promise = require('bluebird');

module.exports = {

  /**
   * List all categories
   *
   * @param {Object} request
   * @param {Object} reply
   * @return {*}
   */
  list(request, reply) {
    const CategoryModel = request.getDb().getModel('Category');

    return CategoryModel.findAll()
      .then((results) => {
        const categories = results.map(category => ({
          id: category.get('id'),
          name: category.get('wp_name'),
          parent: category.get('wp_parent'),
          created_at: category.get('created_at'),
          updated_at: category.get('updated_at')
        }));

        return reply.success({ data: categories });
      })
      .catch(error => reply.serverError(error));
  },

  /**
   * List posts by category
   *
   * @param {Object} request
   * @param {Object} reply
   * @return {*}
   */
  posts(request, reply) {
    const category = request.pre.category;
    const categoryId = request.params.id;

    if (!category) {
      return reply.notFound(new Error(`Category ${categoryId} does not exist`));
    }

    const { limit, page } = request.query;

    return category.findPosts({ limit, page })
      .then((posts) => {
        if (!posts.length) {
          return reply.success({ data: [] });
        }

        const arrPosts = [];

        return Promise.each(posts, (post) => {
          const retrieveAttributes = post.retrieveAttributes();
          const retrieveAssociations = post.retrieveAssociations();

          return Promise.all([retrieveAttributes, retrieveAssociations])
            .then((results) => {
              const [attributes, associations] = results;

              arrPosts.push(Object.assign(attributes, associations));
            });
        })
        .then(() => reply.success({ data: arrPosts }));
      })
      .catch(error => reply.serverError(error));
  }
};
