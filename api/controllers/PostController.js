module.exports = {

  /**
   * Get post details
   *
   * @param {Object} request
   * @param {Object} reply
   * @return {*}
   */
  item(request, reply) {
    const postId = request.params.id;
    const PostModel = request.getDb().getModel('Post');

    return PostModel.findById(postId)
      .then((post) => {
        if (!post) {
          return reply.notFound(new Error(`Post ${postId} does not exist`));
        }

        const content = post.get('content');
        const contentWithHTML = PostModel.withHTML(content);

        return reply.success({
          id: post.get('id'),
          name: post.get('name'),
          title: post.get('title'),
          content: contentWithHTML,
          status: post.get('status'),
          type: post.get('type'),
          created_at: post.get('created_at'),
          updated_at: post.get('updated_at')
        });
      })
      .catch(error => reply.serverError(error));
  }
};
