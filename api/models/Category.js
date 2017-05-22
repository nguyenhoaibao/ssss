const Promise = require('bluebird');

module.exports = function createCategoryModel(sequelize, DataTypes) {
  const Category = sequelize.define(
    'Category',
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
      tableName: 'category',
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
          Category.belongsToMany(models.Post, {
            through: models.CategoryPost,
            foreignKey: 'category_id'
          });
        },

        /**
          * Save array categories.
          * Loop for each category, check to see whether category exists or not.
          * If category exists, update attributes.
          * If not, create new one.
          *
          * @param {Array} categories
          * @return {Promise}
          */
        saveCategories(categoriesData) {
          const objCategories = [];

          return Promise.each(categoriesData, (categoryData) => {
            const cond = {
              where: {
                wp_term_id: categoryData.wp_term_id
              }
            };

            return this.findOne(cond)
              .then((category) => {
                if (!category) {
                  return this.create(categoryData);
                }

                return category.update(categoryData);
              })
              .then(category => objCategories.push(category));
          })
          .then(() => objCategories);
        }
      }
    }
  );

  return Category;
};

