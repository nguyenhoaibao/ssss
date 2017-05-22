const Promise = require('bluebird');
const faker = require('faker');
const chai = require('chai');
const utils = require('../../../libs/helpers/utils');

const MYSQL_DBNAME = utils.getEnv('MYSQL_DBNAME');

const getDB = function getDB(server, dbname) {
  return server.plugins['hapi-sequelize'][dbname];
};

global.expect = chai.expect;

global.genPostData = function genPostData() {
  return {
    wp_ID: faker.random.number(),
    wp_post_author: faker.random.number().toString(),
    wp_post_date: '2017-05-17 04:43:29',
    wp_post_date_gmt: '2017-05-17 04:43:29',
    wp_post_content: faker.lorem.paragraphs(),
    wp_post_title: faker.lorem.words(),
    wp_post_status: 'new',
    wp_comment_status: 'closed',
    wp_post_name: faker.lorem.slug(),
    wp_post_modified: '2017-05-19 03:32:54',
    wp_post_modified_gmt: '2017-05-19 03:32:54',
    wp_post_content_filtered: '',
    wp_post_parent: 0,
    wp_guid: '',
    wp_menu_order: 0,
    wp_post_type: 'post',
    wp_post_mime_type: '',
    wp_comment_count: faker.random.number().toString()
  };
};

global.genAuthorData = function genAuthorData(post) {
  return {
    wp_post_author: post.wp_post_author,
    wp_user_nicename: faker.internet.userName()
  };
};

global.genCategoryData = function genCategoryData() {
  return [{
    wp_term_id: faker.random.number(),
    wp_name: faker.lorem.word(),
    wp_slug: faker.lorem.word(),
    wp_term_group: 0,
    wp_term_taxonomy_id: faker.random.number(),
    wp_taxonomy: 'category',
    wp_parent: 0,
    wp_count: faker.random.number()
  }];
};

global.genTagData = function genTagData() {
  return [{
    wp_term_id: faker.random.number(),
    wp_name: faker.lorem.word(),
    wp_slug: faker.lorem.word(),
    wp_term_group: 0,
    wp_term_taxonomy_id: faker.random.number(),
    wp_taxonomy: 'post_tag',
    wp_parent: 0,
    wp_count: faker.random.number()
  }];
};

global.genFeaturedImage = function genFeaturedImage() {
  return faker.image.imageUrl();
};

global.createCategory = function createCategory(server, dbname = MYSQL_DBNAME) {
  const db = getDB(server, dbname);
  const CategoryModel = db.getModel('Category');

  const categoryData = global.genCategoryData();

  return CategoryModel.create(categoryData[0]);
};

global.createTag = function createTag(server, dbname = MYSQL_DBNAME) {
  const db = getDB(server, dbname);
  const TagModel = db.getModel('Tag');

  const tagData = global.genTagData();

  return TagModel.create(tagData[0]);
};

global.createPost = function createPost(server, dbname = MYSQL_DBNAME) {
  const db = getDB(server, dbname);
  const PostModel = db.getModel('Post');

  return function ({ category, tag } = {}) {
    return PostModel.create(genPostData())
      .then((post) => {
        if (category && tag) {
          return Promise.all([post.setCategories(category), post.setTags(tag)]);
        } else if (category) {
          return post.setCategories(category);
        } else if (tag) {
          return post.setTags(tag);
        }

        return Promise.resolve(post);
      });
  };
}

global.truncate = function (server, dbname = MYSQL_DBNAME) {
  const db = getDB(server, dbname);
  const models = db.sequelize.models;

  return Promise.each(Object.keys(models), (model) => {
    return db.getModel(model).truncate();
  });
};
