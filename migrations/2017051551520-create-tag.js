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
      wp_term_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },
      wp_name: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      wp_slug: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      wp_term_group: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },
      wp_term_taxonomy_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },
      wp_taxonomy: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      wp_parent: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },
      wp_count: {
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

const createUniqueIndex = function createUniqueIndex(queryInterface, indexName, ...field) {
  return queryInterface.addIndex(
    'tag',
    field,
    {
      indexName,
      indicesType: 'UNIQUE'
    }
  );
};

module.exports = {
  up(queryInterface, Sequelize) {
    return createTagTable(queryInterface, Sequelize)
      .then(() => createUniqueIndex(queryInterface, 'idx_wp_term_id', 'wp_term_id'))
      .catch(error => console.log(error));
  },

  down(queryInterface) {
    return queryInterface.dropTable('tag');
  }
};
