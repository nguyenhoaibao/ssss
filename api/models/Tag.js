const Promise = require('bluebird');

module.exports = function createTagModel(sequelize, DataTypes) {
  const Tag = sequelize.define(
    'Tag',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      wp_term_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },
      wp_name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
      },
      wp_slug: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
      },
      wp_term_group: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: ''
      },
      wp_term_taxonomy_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },
      wp_taxonomy: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
      },
      wp_parent: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },
      wp_count: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      tableName: 'tag',
      underscored: true,
      instanceMethods: {

        /**
         * Find posts
         *
         * @return {Promise}
         */
        findPosts({ limit = 10, page = 1 } = {}) {
          const offset = (page - 1) * limit;

          return this.getPosts({ limit, offset });
        }
      },
      classMethods: {
        associate(models) {
          Tag.belongsToMany(models.Post, {
            through: models.TagPost,
            foreignKey: 'tag_id'
          });
        },

        /**
          * Save array tags.
          * Loop for each tag, check to see whether tag exists or not.
          * If tag exists, update attributes.
          * If not, create new one.
          *
          * @param {Array} tags
          * @return {Promise}
          */
        saveTags(tagsData) {
          const objTags = [];

          return Promise.each(tagsData, (tagData) => {
            const cond = {
              where: {
                wp_term_id: tagData.wp_term_id
              }
            };

            return this.findOne(cond)
              .then((tag) => {
                if (!tag) {
                  return this.create(tagData);
                }

                return tag.update(tagData);
              })
              .then(tag => objTags.push(tag));
          })
          .then(() => objTags);
        }
      }
    }
  );

  return Tag;
};

