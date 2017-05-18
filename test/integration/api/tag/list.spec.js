const Hapi = require('hapi');
const plugins = require('../../../../libs/plugins');

describe('Tag List', function () {
  let server;

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
    truncate(server).then(() => done());
  });

  after((done) => {
    server.stop(done);
  });

  it('should return empty array when tag table doesn\'t have any records', (done) => {
    const options = {
      method: 'GET',
      url: '/tags'
    };

    server.inject(options, (res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.result).to.include.keys('data');
      expect(res.result.data).to.be.instanceof(Array);
      expect(res.result.data.length).to.equal(0);

      done();
    });
  });

  it('should return non empty array when tag table has at least 1 record',  (done) => {
    createTag(server)
      .then(() => {
        const options = {
          method: 'GET',
          url: '/tags'
        };

        server.inject(options, (res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.result).to.include.keys('data');
          expect(res.result.data).to.be.instanceof(Array);
          expect(res.result.data.length).to.above(0);

          const tags = res.result.data;
          tags.forEach((tag) => {
            expect(tag).to.contain.all.keys(
              'id',
              'content',
              'created_at',
              'updated_at'
            );
          });

          done();
        });
      });
  });
});
