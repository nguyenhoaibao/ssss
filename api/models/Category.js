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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
      },
      parent: {
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
        findPosts() {
          return this.getPosts();
        }
      },
      classMethods: {
        associate(models) {
          Category.hasMany(models.Post);
        }
      }
    }
  );

  return Category;
};

