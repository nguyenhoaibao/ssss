const createCategoryTable = function createCategoryTable(queryInterface, Sequelize) {
  return queryInterface.createTable(
    'category',
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
      parent: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
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
    return createCategoryTable(queryInterface, Sequelize)
      .catch(error => console.log(error));
  },

  down(queryInterface) {
    return queryInterface.dropTable('category');
  }
};
