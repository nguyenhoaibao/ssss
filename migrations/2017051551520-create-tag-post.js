const createTagPostTable = function createTagPostTable(queryInterface, Sequelize) {
  return queryInterface.createTable(
    'tag_post',
    {
      tag_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      post_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
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
    return createTagPostTable(queryInterface, Sequelize)
      .catch(error => console.log(error));
  },

  down(queryInterface) {
    return queryInterface.dropTable('tag_post');
  }
};
