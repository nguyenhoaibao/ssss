const Promise = require('bluebird');

module.exports = {

  /**
   * List all tags
   *
   * @param {Object} request
   * @param {Object} reply
   * @return {*}
   */
  list(request, reply) {
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
      .then((posts) => {
        if (!posts.length) {
          return reply.success({ data: [] });
        }

        const PostModel = request.getDb().getModel('Post');
        const arrPosts = [];

        return Promise.each(posts, (post) => {
          const retrieveAttributes = PostModel.retrieveAttributes(post);
          const retrieveAssociations = PostModel.retrieveAssociations(post);

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

