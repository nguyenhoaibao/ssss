const Hapi = require('hapi');
const plugins = require('../../../../libs/plugins');

describe('Post Item', function () {
  let server;
  let createdPost;

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
      .then(() => createPost(server)())
      .then(post => createdPost = post)
      .then(() => done());
  });

  after((done) => {
    server.stop(done);
  });

  it('should return error notFound when post id doesn\'t exist', (done) => {
    const notExistedPostId = 99999;
    const options = {
      method: 'GET',
      url: `/posts/${notExistedPostId}`
    };

    server.inject(options, (res) => {
      expect(res.statusCode).to.equal(404);
      expect(res.result).to.include.keys('error');

      done();
    });
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
        'featured_image',
        'created_at',
        'updated_at'
      );

      done();
    });
  });
});
