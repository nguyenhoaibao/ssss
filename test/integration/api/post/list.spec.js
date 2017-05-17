const Hapi = require('hapi');
const plugins = require('../../../../libs/plugins');

describe('Post List', function () {
  let server;
  let createdCategory;

  beforeEach((done) => {
    server = new Hapi.Server();
    server.connection();

    server.register(plugins, (error) => {
      truncate(server)
        .then(() => createCategory(server))
        .then(category => createdCategory = category)
        .then(() => done());
    });
  });

  afterEach((done) => {
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

  it('should return empty array when category doesn\'t have any posts');

  it('should return posts array when category has at least 1 post', (done) => {
    const createPostByCategory = createPost(server);

    createPostByCategory(createdCategory)
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
            console.log(post)
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

