const createUserTable = function createUserTable(queryInterface, Sequelize) {
  return queryInterface.createTable(
    'user',
    {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      wp_post_author: {
        // SEE: https://stackoverflow.com/questions/1814532/1071-specified-key-was-too-long-max-key-length-is-767-bytes
        type: Sequelize.STRING(191),
        allowNull: false,
        defaultValue: ''
      },
      wp_display_name: {
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

const createUniqueIndex = function createUniqueIndex(queryInterface, indexName, ...field) {
  return queryInterface.addIndex(
    'user',
    field,
    {
      indexName,
      indicesType: 'UNIQUE'
    }
  );
};

module.exports = {
  up(queryInterface, Sequelize) {
    return createUserTable(queryInterface, Sequelize)
      .then(() => createUniqueIndex(queryInterface, 'idx_wp_post_author', 'wp_post_author'))
      .catch(error => console.log(error));
  },

  down(queryInterface) {
    return queryInterface.dropTable('user');
  }
};
