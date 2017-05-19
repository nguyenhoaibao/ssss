const Hapi = require('Hapi');
const plugins = require('../../../../libs/plugins');

describe('Post Create', function () {
  let server;

  before((done) => {
    server = new Hapi.Server();
    server.connection();

    server.register(plugins, (error) => {
      if (error) {
        return done(error);
      }

      return done()
    });
  });

  beforeEach((done) => {
    truncate(server).then(() => done());
  });

  after((done) => {
    server.stop(done);
  });

  it('should create new post success', (done) => {
    const post = genPostData();
    const author = genAuthorData(post);
    const categories = genCategoryData();
    const tags = genTagData();

    const options = {
      method: 'POST',
      url: '/posts',
      payload: {
        post,
        author,
        categories,
        tags
      }
    };

    server.inject(options, (res) => {
      expect(res.statusCode).to.equal(200);

      done();
    });
  });
});
