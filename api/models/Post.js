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
          Post.belongsToMany(models.Category, {
            through: models.CategoryPost,
            foreignKey: 'post_id'
          });
          Post.belongsToMany(models.Tag, {
            through: models.TagPost,
            foreignKey: 'post_id'
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
        }
      }
    }
  );

  return Post;
};
