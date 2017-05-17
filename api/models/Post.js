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
      category_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
      },
      content: {
        type: DataTypes.TEXT('long')
      },
      status: {
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
      type: {
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
      }
    },
    {
      tableName: 'post',
      underscored: true,
      classMethods: {
        associate(models) {
          Post.belongsTo(models.Category);
        },

        /**
         * Create post by category
         *
         * @param {Object} postData
         * @param {Object} category
         * @return {Promise}
         */
        createPostByCategory(postData, category) {
          const post = this.build(postData);

          post.setCategory(category, { save: false });

          return post.save();
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
            .filter(p => !utils.isEmptyLine(p));

          const parapraphs = `<p>${arrParagraphs.join('</p><p>')}</p>`;

          return parapraphs;
        }
      }
    }
  );

  return Post;
};
