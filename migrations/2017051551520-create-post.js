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
      wp_ID: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },
      wp_post_author: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      wp_post_date: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      wp_post_date_gmt: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      wp_post_content: {
        type: Sequelize.TEXT('long')
      },
      wp_post_title: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      wp_post_status: {
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
      wp_comment_status: {
        type: Sequelize.ENUM(
          'open',
          'closed'
        ),
        allowNull: false,
        defaultValue: 'closed'
      },
      wp_post_name: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      wp_post_modified: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      wp_post_modified_gmt: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      wp_post_content_filtered: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      wp_post_parent: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      wp_guid: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      wp_menu_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      wp_post_type: {
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
      wp_post_mime_type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      wp_comment_count: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      wp_featured_image: {
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
    'post',
    field,
    {
      indexName,
      indicesType: 'UNIQUE'
    }
  );
};

module.exports = {
  up(queryInterface, Sequelize) {
    return createPostTable(queryInterface, Sequelize)
      .then(() => createUniqueIndex(queryInterface, 'idx_wp_id', 'wp_ID'))
      .catch(error => console.log(error));
  },

  down(queryInterface) {
    return queryInterface.dropTable('post');
  }
};
