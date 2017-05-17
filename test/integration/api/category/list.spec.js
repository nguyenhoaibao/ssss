const Hapi = require('hapi');
const plugins = require('../../../../libs/plugins');

describe('Category List', function () {
  let server;

  beforeEach((done) => {
    server = new Hapi.Server();
    server.connection();

    server.register(plugins, (error) => {
      truncate(server)
        .then(() => done());
    });
  });

  afterEach((done) => {
    server.stop(done);
  });

  it('should return empty array when category table doesn\'t have any records', (done) => {
    const options = {
      method: 'GET',
      url: '/categories'
    };

    server.inject(options, (res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.result).to.include.keys('data');
      expect(res.result.data).to.be.instanceof(Array);
      expect(res.result.data.length).to.equal(0);

      done();
    });
  });

  it('should return non empty array when category table has at least 1 record',  (done) => {
    createCategory(server)
      .then(() => {
        const options = {
          method: 'GET',
          url: '/categories'
        };

        server.inject(options, (res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.result).to.include.keys('data');
          expect(res.result.data).to.be.instanceof(Array);
          expect(res.result.data.length).to.above(0);

          const categories = res.result.data;
          categories.forEach((category) => {
            expect(category).to.contain.all.keys(['id', 'name', 'parent']);
          });

          done();
        });
      });
  });
});
