module.exports = function createUserModel(sequelize, DataTypes) {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      wp_post_author: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
      },
      wp_display_name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
      }
    },
    {
      tableName: 'user',
      underscored: true,
      classMethods: {
        associate(models) {
          User.hasMany(models.Post, {
            foreignKey: 'wp_post_author',
            sourceKey: 'wp_post_author'
          });
        },

        /**
         * If wp_post_author does not exist, create new user.
         * Otherwise, update user details.
         *
         * @param {Object} userData
         * @return {Promise}
         */
        saveUser(userData) {
          const cond = {
            where: {
              wp_post_author: userData.wp_post_author
            }
          };

          return this.findOne(cond)
            .then((user) => {
              if (!user) {
                return this.create(userData);
              }

              return user.update(userData);
            });
        }
      }
    }
  );

  return User;
};
