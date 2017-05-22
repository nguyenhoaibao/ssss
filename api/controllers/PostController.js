const Promise = require('bluebird');

module.exports = {

  /**
   * Create post
   *
   * @param {Object} request
   * @param {Object} reply
   * @return {*}
   */
  create(request, reply) {
    const PostModel = request.getDb().getModel('Post');
    const UserModel = request.getDb().getModel('User');
    const CategoryModel = request.getDb().getModel('Category');
    const TagModel = request.getDb().getModel('Tag');

    const payload = request.payload;

    const {
      post,
      author,
      categories,
      tags,
      featured_image: featuredImage
    } = payload;

    const postWithFeaturedImage = Object.assign(post, { wp_featured_image: featuredImage });

    const savePost = PostModel.savePost(postWithFeaturedImage);
    const saveUser = UserModel.saveUser(author);
    const saveCategories = CategoryModel.saveCategories(categories);
    const saveTags = TagModel.saveTags(tags);

    return Promise.all([savePost, saveUser, saveCategories, saveTags])
      .then((results) => {
        const [
          objPost,
          objUser,
          objCategories,
          objTags
        ] = results;

        const setPostUser = objPost.setUser(objUser);
        const setPostCategories = objPost.setCategories(objCategories);
        const setPostTags = objPost.setTags(objTags);

        return Promise.all([setPostUser, setPostCategories, setPostTags]);
      })
      .then(() => reply.success({ status: 'success' }))
      .catch(error => reply.serverError(error));
  },

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

        const retrieveAttributes = post.retrieveAttributesWithHTMLContent();
        const retrieveAssociations = post.retrieveAssociations();

        return Promise.all([retrieveAttributes, retrieveAssociations])
          .then((results) => {
            const [attributes, associations] = results;
            return reply.success(Object.assign(attributes, associations));
          });
      })
      .catch(error => reply.serverError(error));
  },

  /**
   * List posts
   *
   * @param {Object} request
   * @param {Object} reply
   * @return {*}
   */
  list(request, reply) {
    const PostModel = request.getDb().getModel('Post');
    const query = request.query;

    const {
      category,
      tag,
      limit,
      page
    } = query;

    return PostModel.findPosts({ category, tag, limit, page })
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
