/* eslint-disable */
const Promise = require('bluebird');
const program = require('commander');
const Sequelize = require('sequelize');

program
  .version('0.0.1')
  .option('--wp-host <string>', 'Wordpress DB Host')
  .option('--wp-port <string>', 'Wordpress DB Port')
  .option('--wp-username <string>', 'Wordpress DB Username')
  .option('--wp-password <string>', 'Wordpress DB Password')
  .option('--wp-dbname <string>', 'Wordpress DB Name')
  .option('--api-host <string>', 'API DB Host')
  .option('--api-port <string>', 'API DB Port')
  .option('--api-username <string>', 'API DB Username')
  .option('--api-password <string>', 'API DB Password')
  .option('--api-dbname <string>', 'API DB Name')
  .parse(process.argv);

if (!program.wpHost
  || !program.wpPort
  || !program.wpUsername
  || !program.wpPassword
  || !program.wpDbname
  || !program.apiHost
  || !program.apiPort
  || !program.apiUsername
  || !program.apiPassword
  || !program.apiDbname
) {
  console.log('Not enough arguments. Run --help.');
  process.exit();
}

const WP_HOST = program.wpHost;
const WP_PORT = program.wpPort;
const WP_USERNAME = program.wpUsername
const WP_PASSWORD = program.wpPassword;
const WP_DBNAME = program.wpDbname;
const wpConnStr = `mysql://${WP_USERNAME}:${WP_PASSWORD}@${WP_HOST}:${WP_PORT}/${WP_DBNAME}`;
const wpSequelize = new Sequelize(wpConnStr);

const API_HOST = program.apiHost;
const API_PORT = program.apiPort;
const API_USERNAME = program.apiUsername;
const API_PASSWORD = program.apiPassword;
const API_DBNAME = program.apiDbname;
const apiConnStr = `mysql://${API_USERNAME}:${API_PASSWORD}@${API_HOST}:${API_PORT}/${API_DBNAME}`;
const apiSequelize = new Sequelize(apiConnStr);

function initModels(s) {
  // import function provided by sequelize instance.
  // Use this function to import model (instead of require-ing directly)
  // to use sequelize associations between models.
  const i = s.import.bind(s);
  const Post = i('../api/models/Post');
  const User = i('../api/models/User');
  const Category = i('../api/models/Category');
  const CategoryPost = i('../api/models/CategoryPost');
  const Tag = i('../api/models/Tag');
  const TagPost = i('../api/models/TagPost');

  const models = {
    [Post.name]: Post,
    [User.name]: User,
    [Category.name]: Category,
    [CategoryPost.name]: CategoryPost,
    [Tag.name]: Tag,
    [TagPost.name]: TagPost
  };

  Post.associate(models);
  User.associate(models);
  Category.associate(models);
  Tag.associate(models);

  return models;
}

const Sync = function Sync(options) {
  const { apiS, apiModels, wpS } = options;

  return {
    /**
     * Retrieve WP posts with post_type = "post" and post_status = "publish"
     *
     * @return {Object}
     */
    retrieveWPPosts() {
      const queryStr = 'SELECT * FROM wp_posts WHERE post_type = "post" AND post_status = "publish"';

      return wpS.query(queryStr, { type: wpS.QueryTypes.SELECT })
        .then((posts) => {
          if (!posts.length) {
            return null;
          }

          const wpIDMapPostData = {};

          posts.forEach((post) => {
            const wpID = post.ID;

            wpIDMapPostData[wpID] = {
              wp_ID: wpID,
              wp_post_author: post.post_author,
              wp_post_date: post.post_date,
              wp_post_date_gmt: post.post_date_gmt,
              wp_post_content: post.post_content,
              wp_post_title: post.post_title,
              wp_post_status: post.post_status,
              wp_comment_status: post.comment_status,
              wp_post_name: post.post_name,
              wp_post_modified: post.post_modified,
              wp_post_modified_gmt: post.post_modified_gmt,
              wp_post_content_filtered: post.post_content_filtered,
              wp_post_parent: post.post_parent,
              wp_post_guid: post.guid,
              wp_menu_order: post.menu_order,
              wp_post_type: post.post_type,
              wp_post_mime_type: post.post_mime_type,
              wp_comment_count: post.comment_count
            }
          });

          return wpIDMapPostData;
        })
        .catch(error => Promise.reject(error));
    },

    /**
     * Retrieve WP posts's featured images
     *
     * @return {Object}
     */
    retrieveWPFeaturedImages() {
      const queryStr = 'SELECT wp.post_parent, wp.guid from wp_posts wp' +
        ' INNER JOIN wp_postmeta wpm ON wp.ID = CAST(wpm.meta_value as UNSIGNED)' +
        ' WHERE wpm.meta_key = "_thumbnail_id"';

      return wpS.query(queryStr, { type: wpS.QueryTypes.SELECT })
        .then((posts) => {
          if (!posts.length) {
            return null;
          }

          const wpIDMapFeaturedImage = {};

          posts.forEach((post) => {
            wpIDMapFeaturedImage[post.post_parent] = post.guid;
          });

          return wpIDMapFeaturedImage;
        })
        .catch(error => Promise.reject(error));
    },

    /**
     * Retrieve WP posts and featured images in parallel.
     * If any post has a featured image,
     * that image will be embeded into the post object.
     * This makes sure that the API DB will have enough information
     * including data and featured image.
     *
     * @return {Object}
     */
    retrieveWPPostsWithFeaturedImage() {
      const retrieveWPPosts = this.retrieveWPPosts();
      const retrieveWPFeaturedImages = this.retrieveWPFeaturedImages();

      return Promise.all([retrieveWPPosts, retrieveWPFeaturedImages])
        .then((results) => {
          const [wpIDMapPostData, wpIDMapFeaturedImage] = results;

          Object.keys(wpIDMapFeaturedImage).forEach((wpID) => {
            if (wpIDMapPostData[wpID]) {
              const featuredImageUrl = wpIDMapFeaturedImage[wpID];

              wpIDMapPostData[wpID].wp_featured_image = featuredImageUrl;
            }
          });

          return wpIDMapPostData;
        });
    },

    /**
     * Insert posts to the API's DB (upsert)
     *
     * @return {Promise}
     */
    insertPostsToAPIDB(posts) {
      const options = {
        individualHooks: true,
        updateOnDuplicate: [
          'wp_post_author',
          'wp_post_date',
          'wp_post_date_gmt',
          'wp_post_content',
          'wp_post_title',
          'wp_post_status',
          'wp_comment_status',
          'wp_post_name',
          'wp_post_modified',
          'wp_post_modified_gmt',
          'wp_post_content_filtered',
          'wp_post_parent',
          'wp_guid',
          'wp_menu_order',
          'wp_post_type',
          'wp_post_mime_type',
          'wp_comment_count'
        ]
      };

      return apiModels.Post.bulkCreate(posts, options);
    },

    /**
     * Retrieve users
     *
     * @return {Object}
     */
    retrieveWPUsers() {
      const queryStr = 'SELECT * FROM wp_users';

      return wpS.query(queryStr, { type: wpS.QueryTypes.SELECT })
        .then((users) => {
          if (!users.length) {
            return null;
          }

          return users.map(user => ({
            wp_post_author: user.ID,
            wp_display_name: user.display_name
          }));
        })
        .catch(error => Promise.reject(error));
    },

    /**
     * Insert users to API's DB
     *
     * @param {Array} users
     * @return {Promise}
     */
    insertUsersToAPIDB(users) {
      const options = {
        individualHooks: true,
        updateOnDuplicate: [
          'wp_post_author',
          'wp_display_name'
        ]
      };

      return apiModels.User.bulkCreate(users, options);
    },

    /**
     * Retrieve taxonomies by type
     *
     * @param {String} type
     * @return {Array}
     */
    retrieveTaxonomies(type) {
      const queryStr = 'SELECT * FROM wp_term_taxonomy wtt' +
        ' INNER JOIN wp_terms wt ON wtt.term_id = wt.term_id' +
        ` WHERE wtt.taxonomy = "${type}"`;

      return wpS.query(queryStr, { type: wpS.QueryTypes.SELECT })
        .then((taxonomies) => {
          if (!taxonomies.length) {
            return null;
          }

          return taxonomies.map(taxonomy => ({
            wp_term_id: taxonomy.term_id,
            wp_name: taxonomy.name,
            wp_slug: taxonomy.slug,
            wp_term_group: taxonomy.term_group,
            wp_term_taxonomy_id: taxonomy.term_taxonomy_id,
            wp_taxonomy: taxonomy.taxonomy,
            wp_parent: taxonomy.parent,
            wp_count: taxonomy.count
          }));
        })
        .catch(error => Promise.reject(error));
    },

    /**
     * Insert categories to the API's DB (upsert)
     *
     * @return {Promise}
     */
    insertCategoriesToAPIDB(categories) {
      const options = {
        individualHooks: true,
        updateOnDuplicate: [
          'wp_term_id',
          'wp_name',
          'wp_slug',
          'wp_term_group',
          'wp_term_taxonomy_id',
          'wp_taxonomy',
          'wp_parent',
          'wp_count'
        ]
      };

      return apiModels.Category.bulkCreate(categories, options);
    },

    /**
     * Insert tags to the API's DB (upsert)
     *
     * @return {Promise}
     */
    insertTagsToAPIDB(tags) {
      const options = {
        individualHooks: true,
        updateOnDuplicate: [
          'wp_term_id',
          'wp_name',
          'wp_slug',
          'wp_term_group',
          'wp_term_taxonomy_id',
          'wp_taxonomy',
          'wp_parent',
          'wp_count'
        ]
      };

      return apiModels.Tag.bulkCreate(tags, options);
    },

    /**
     * Apply associations
     *
     * @return {Object}
     */
    applyAssociations(insertedPosts, insertedCategories, insertedTags) {
      const queryStr = 'SELECT * FROM wp_term_relationships';

      return wpS.query(queryStr, { type: wpS.QueryTypes.SELECT })
        .then((termRelations) => {
          const relations = {};

          termRelations.forEach((termRelation) => {
            const postID = termRelation.object_id;
            const termTaxonomyId = termRelation.term_taxonomy_id;

            if (!relations[postID]) {
              relations[postID] = {
                post: null,
                categories: [],
                tags: []
              };
            }

            const post = insertedPosts.find(insertedPost => insertedPost.wp_ID === postID);
            const category = insertedCategories.find(insertedCategory => (
             insertedCategory.wp_term_taxonomy_id === termTaxonomyId
            ));
            const tag = insertedTags.find(insertedTag => (
              insertedTag.wp_term_taxonomy_id === termTaxonomyId
            ));

            if (!relations[postID].post && post) {
              relations[postID].post = post;
            }

            if (category) {
              relations[postID].categories.push(category);
            }

            if (tag) {
              relations[postID].tags.push(tag);
            }
          });

          return relations;
        })
        .then((relations) => {
          return Promise.each(Object.values(relations), (relation) => {
            const {
              post,
              categories,
              tags
            } = relation;

            if (!post) {
              return Promise.resolve();
            }

            let setCategories = Promise.resolve();
            let setTags = Promise.resolve();

            if (categories.length) {
              setCategories = post.setCategories(categories);
            }

            if (tags.length) {
              setTags = post.setTags(tags);
            }

            return Promise.all([setCategories, setTags]);
          });
        });
    },

    /**
     * Main function
     *
     */
    execute() {
      let insertedPosts;
      let insertedCategories;
      let insertedTags;

      return this.retrieveWPUsers()
        .then(users => this.insertUsersToAPIDB(users))
        .then(() => this.retrieveWPPostsWithFeaturedImage())
        .then((wpIDMapPostData) => {
          const posts = Object.values(wpIDMapPostData);

          return this.insertPostsToAPIDB(posts);
        })
        .then((posts) => {
          insertedPosts = posts;

          return Promise.all([
            sync.retrieveTaxonomies('category'),
            sync.retrieveTaxonomies('post_tag')
          ]);
        })
        .then((results) => {
          const [categories, tags] = results;

          return Promise.all([
            sync.insertCategoriesToAPIDB(categories),
            sync.insertTagsToAPIDB(tags)
          ]);
        })
        .then((results) => {
          insertedCategories = results[0];
          insertedTags = results[1];

          return this.applyAssociations(insertedPosts, insertedCategories, insertedTags);
        })
        .catch(error => console.log(error));
    }
  }
};

const models = initModels(apiSequelize);
const sync = Sync({ apiS: apiSequelize, apiModels: models, wpS: wpSequelize });
sync.execute();
