const Promise = require('bluebird');
const faker = require('faker');
const chai = require('chai');
const utils = require('../../../libs/helpers/utils');

const MYSQL_DBNAME = utils.getEnv('MYSQL_DBNAME');

const getDB = function getDB(server, dbname) {
  return server.plugins['hapi-sequelize'][dbname];
};

global.expect = chai.expect;

global.createCategory = function createCategory(server, dbname = MYSQL_DBNAME) {
  const db = getDB(server, dbname);
  const CategoryModel = db.getModel('Category');

  const data = {
    name: faker.lorem.word(),
    parent: 0
  };

  return CategoryModel.create(data);
};

global.createPost = function createPost(server, dbname = MYSQL_DBNAME) {
  const db = getDB(server, dbname);
  const PostModel = db.getModel('Post');

  const data = {
    name: faker.lorem.word(),
    title: faker.lorem.words(),
    content: faker.lorem.paragraphs(),
    status: 'new',
    type: 'post'
  };

  return function (category) {
    return PostModel.createPostByCategory(data, category);
  };
}

global.truncate = function (server, dbname = MYSQL_DBNAME) {
  const db = getDB(server, dbname);
  const models = db.sequelize.models;

  return Promise.each(Object.keys(models), (model) => {
    return db.getModel(model).truncate();
  });
};
