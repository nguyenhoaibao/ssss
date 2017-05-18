module.exports = {

  /**
   * List all tags
   *
   * @param {Object} request
   * @param {Object} reply
   * @return {*}
   */
  all(request, reply) {
    const TagModel = request.getDb().getModel('Tag');

    return TagModel.findAll()
      .then((results) => {
        const tags = results.map(tag => ({
          id: tag.get('id'),
          content: tag.get('conten'),
          created_at: tag.get('created_at'),
          updated_at: tag.get('updated_at')
        }));

        return reply.success({ data: tags });
      })
      .catch(error => reply.serverError(error));
  },

  /**
   * List posts by tag
   *
   * @param {Object} request
   * @param {Object} reply
   * @return {*}
   */
  posts(request, reply) {
    const tag = request.pre.tag;
    const tagId = request.params.id;

    if (!tag) {
      return reply.notFound(new Error(`Tag ${tagId} does not exist`));
    }

    return tag.findPosts()
      .then((results) => {
        const posts = results.map(post => ({
          id: post.get('id'),
          name: post.get('name'),
          title: post.get('title'),
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

