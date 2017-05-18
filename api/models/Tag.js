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
      content: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
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
        findPosts() {
          return this.getPosts();
        }
      },
      classMethods: {
        associate(models) {
          Tag.belongsToMany(models.Post, {
            through: models.TagPost,
            foreignKey: 'tag_id'
          });
        }
      }
    }
  );

  return Tag;
};

