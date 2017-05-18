const createTagTable = function createTagTable(queryInterface, Sequelize) {
  return queryInterface.createTable(
    'tag',
    {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
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
    return createTagTable(queryInterface, Sequelize)
      .catch(error => console.log(error));
  },

  down(queryInterface) {
    return queryInterface.dropTable('tag');
  }
};
