const Hapi = require('hapi');
const plugins = require('../../../../libs/plugins');

describe('Post List', function () {
  let server;
  let createdCategory;
  let createdTag;

  before((done) => {
    server = new Hapi.Server();
    server.connection();

    server.register(plugins, (error) => {
      if (error) {
        return done(error);
      }

      return done();
    });
  });

  beforeEach((done) => {
    truncate(server)
      .then(() => createCategory(server))
      .then(category => createdCategory = category)
      .then(() => createTag(server))
      .then(tag => createdTag = tag)
      .then(() => done());
  });

  after((done) => {
    server.stop(done);
  });

  it('should return error notFound when category id doesn\'t exist', (done) => {
    const notExistedCategoryId = 999999;
    const options = {
      method: 'GET',
      url: `/categories/${notExistedCategoryId}/posts`
    };

    server.inject(options, (res) => {
      expect(res.statusCode).to.equal(404);
      expect(res.result).to.include.keys('error');

      done();
    });
  });

  it('should return empty array when category doesn\'t have any posts', (done) => {
    const options = {
      method: 'GET',
      url: `/categories/${createdCategory.id}/posts`
    };

    server.inject(options, (res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.result).to.include.keys('data');
      expect(res.result.data).to.instanceof(Array);
      expect(res.result.data.length).to.equal(0);

      done();
    });
  });

  it('should return posts array when category has at least 1 post', (done) => {
    const createPostByCategory = createPost(server);

    createPostByCategory({ category: createdCategory })
      .then(() => {
        const options = {
          method: 'GET',
          url: `/categories/${createdCategory.id}/posts`
        };

        server.inject(options, (res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.result).to.include.keys('data');
          expect(res.result.data).to.be.instanceof(Array);
          expect(res.result.data.length).to.above(0);

          const posts = res.result.data;
          posts.forEach((post) => {
            expect(post).to.contain.all.keys(
              'id',
              'name',
              'title',
              'status',
              'type',
              'created_at',
              'updated_at'
            );
          });

          done();
        });
      });
  });

  it('should return error notFound when tag id doesn\'t exist', (done) => {
    const notExistedTagId = 999999;
    const options = {
      method: 'GET',
      url: `/tags/${notExistedTagId}/posts`
    };

    server.inject(options, (res) => {
      expect(res.statusCode).to.equal(404);
      expect(res.result).to.include.keys('error');

      done();
    });
  });

  it('should return empty array when tag doesn\'t have any posts', (done) => {
    const options = {
      method: 'GET',
      url: `/tags/${createdTag.id}/posts`
    };

    server.inject(options, (res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.result).to.include.keys('data');
      expect(res.result.data).to.instanceof(Array);
      expect(res.result.data.length).to.equal(0);

      done();
    });
  });

  it('should return posts array when tag has at least 1 post', (done) => {
    const createPostByTag = createPost(server);

    createPostByTag({ tag: createdTag })
      .then(() => {
        const options = {
          method: 'GET',
          url: `/tags/${createdTag.id}/posts`
        };

        server.inject(options, (res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.result).to.include.keys('data');
          expect(res.result.data).to.be.instanceof(Array);
          expect(res.result.data.length).to.above(0);

          const posts = res.result.data;
          posts.forEach((post) => {
            expect(post).to.contain.all.keys(
              'id',
              'name',
              'title',
              'status',
              'type',
              'created_at',
              'updated_at'
            );
          });

          done();
        });
      });
  });
});

