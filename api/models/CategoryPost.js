module.exports = function createCategoryPostModel(sequelize, DataTypes) {
  const CategoryPost = sequelize.define(
    'CategoryPost',
    {
      category_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      post_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      }
    },
    {
      tableName: 'category_post',
      underscored: true
    }
  );

  return CategoryPost;
};

