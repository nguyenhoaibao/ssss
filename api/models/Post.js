const entities = require('entities');
const utils = require('../../libs/helpers/utils');

module.exports = function createPostModel(sequelize, DataTypes) {
  const Post = sequelize.define(
    'Post',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      wp_ID: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        unique: true
      },
      wp_post_author: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
      },
      wp_post_date: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
      },
      wp_post_date_gmt: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
      },
      wp_post_content: {
        type: DataTypes.TEXT('long')
      },
      wp_post_title: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
      },
      wp_post_status: {
        type: DataTypes.ENUM(
          'new',
          'publish',
          'pending',
          'draft',
          'auto-draft',
          'future',
          'private',
          'inherit',
          'trash'
        ),
        allowNull: false,
        defaultValue: 'new'
      },
      wp_comment_status: {
        type: DataTypes.ENUM(
          'open',
          'closed'
        ),
        allowNull: false,
        defaultValue: 'closed'
      },
      wp_post_name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
      },
      wp_post_modified: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
      },
      wp_post_modified_gmt: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
      },
      wp_post_content_filtered: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
      },
      wp_post_parent: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      wp_guid: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
      },
      wp_menu_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      wp_post_type: {
        type: DataTypes.ENUM(
          'post',
          'page',
          'attachment',
          'revision',
          'nav_menu_item',
          'custom_css',
          'customize_changeset'
        ),
        allowNull: false,
        defaultValue: 'post'
      },
      wp_post_mime_type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
      },
      wp_comment_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      tableName: 'post',
      underscored: true,
      classMethods: {
        associate(models) {
          Post.belongsToMany(models.Category, {
            through: models.CategoryPost,
            foreignKey: 'post_id'
          });
          Post.belongsToMany(models.Tag, {
            through: models.TagPost,
            foreignKey: 'post_id'
          });
          Post.belongsTo(models.User, {
            foreignKey: 'wp_post_author',
            targetKey: 'wp_post_author'
          });
        },

        /**
         * Transform content to html
         *
         * @param {String} content
         * @return {String}
         */
        withHTML(content) {
          const arrParagraphs = content
            .split(/[\r\n]/gm)
            .filter(p => !utils.isEmptyLine(p))
            .map(p => entities.decodeHTML(p));

          const parapraphs = `<p>${arrParagraphs.join('</p><p>')}</p>`;

          return parapraphs;
        },

        /**
         * If wp_ID does not exist, create new post.
         * Otherwise, update post details.
         *
         * @param {Object} postData
         * @return {Promise}
         */
        savePost(postData) {
          const cond = {
            where: {
              wp_ID: postData.wp_ID
            }
          };

          return this.findOne(cond)
            .then((post) => {
              if (!post) {
                return this.create(postData);
              }

              return post.update(postData);
            })
            .catch(error => Promise.reject(error));
        },

        /**
         * Retrieve post attributes
         *
         * @param {Object} post
         * @return {Object}
         */
        retrieveAttributes(post) {
          return Promise.resolve()
            .then(() => ({
              id: post.get('id'),
              name: post.get('wp_post_name'),
              title: post.get('wp_post_title'),
              status: post.get('wp_post_status'),
              type: post.get('wp_post_type'),
              created_at: post.get('wp_post_date_gmt'),
              updated_at: post.get('wp_post_modified_gmt')
            }));
        },

        /**
         * Retrieve post attributes with HTML content
         *
         * @param {Object} post
         * @return {Object}
         */
        retrieveAttributesWithHTMLContent(post) {
          return this.retrieveAttributes(post)
            .then((postAttributes) => {
              const content = post.get('wp_post_content');
              const HTMLContent = this.withHTML(content);

              return Object.assign(postAttributes, { content: HTMLContent });
            });
        },

        /**
         * Retrieve post associations
         *
         * @param {Object} post
         * @return {Object}
         */
        retrieveAssociations(post) {
          const getUser = post.getUser();
          const getCategories = post.getCategories();
          const getTags = post.getTags();

          const associations = {};

          return Promise.all([getUser, getCategories, getTags])
            .then((results) => {
              const [user, categories, tags] = results;

              if (user) {
                associations.user = {
                  id: user.get('id'),
                  name: user.get('wp_user_nicename')
                };
              }

              if (categories.length) {
                associations.categories = [];

                categories.forEach(category => associations.categories.push({
                  id: category.get('id'),
                  name: category.get('wp_name')
                }));
              }

              if (tags.length) {
                associations.tags = [];

                tags.forEach(tag => associations.tags.push({
                  id: tag.get('id'),
                  name: tag.get('wp_name')
                }));
              }

              return associations;
            });
        }
      }
    }
  );

  return Post;
};
