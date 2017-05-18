const createPostTable = function createPostTable(queryInterface, Sequelize) {
  return queryInterface.createTable(
    'post',
    {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      content: {
        type: Sequelize.TEXT('long')
      },
      status: {
        type: Sequelize.ENUM(
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
        type: Sequelize.ENUM(
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
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    },
    {
      engine: 'InnoDB',
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  );
};

module.exports = {
  up(queryInterface, Sequelize) {
    return createPostTable(queryInterface, Sequelize)
      .catch(error => console.log(error));
  },

  down(queryInterface) {
    return queryInterface.dropTable('post');
  }
};
