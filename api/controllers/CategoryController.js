module.exports = {

  /**
   * List all categories
   *
   * @param {Object} request
   * @param {Object} reply
   * @return {*}
   */
  all(request, reply) {
    const CategoryModel = request.getDb().getModel('Category');

    return CategoryModel.findAll()
      .then((results) => {
        const categories = results.map(category => ({
          id: category.id,
          name: category.name,
          parent: category.parent
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

    return category.findPosts()
      .then((results) => {
        const posts = results.map(post => ({
          id: post.get('id'),
          name: post.get('name'),
          title: post.get('title'),
          content: post.get('content'),
          status: post.get('status'),
          type: post.get('type'),
          created_at: post.get('created_at'),
          updated_at: post.get('updated_at')
        }));

        return reply.success({ data: posts });
      })
      .catch(error => reply.serverError(error));
  }
};
