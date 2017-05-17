const Hapi = require('hapi');
const plugins = require('../../../../libs/plugins');

describe('Post Item', function () {
  let server;
  let createdCategory;
  let createdPost;

  beforeEach((done) => {
    server = new Hapi.Server();
    server.connection();

    server.register(plugins, (error) => {
      truncate(server)
        .then(() => createCategory(server))
        .then((category) => {
          createdCategory = category;

          const createPostByCategory = createPost(server);

          return createPostByCategory(category);
        })
        .then(post => createdPost = post)
        .then(() => done());
    });
  });

  afterEach((done) => {
    server.stop(done);
  });

  it('should return post details', (done) => {
    const options = {
      method: 'GET',
      url: `/posts/${createdPost.id}`
    };

    server.inject(options, (res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.result).to.contain.all.keys(
        'id',
        'name',
        'title',
        'content',
        'status',
        'type',
        'created_at',
        'updated_at'
      );

      done();
    });
  });
});


