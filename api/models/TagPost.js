module.exports = function createTagPostModel(sequelize, DataTypes) {
  const TagPost = sequelize.define(
    'TagPost',
    {
      tag_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      post_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      }
    },
    {
      tableName: 'tag_post',
      underscored: true
    }
  );

  return TagPost;
};

