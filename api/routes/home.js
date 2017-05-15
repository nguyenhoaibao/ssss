module.exports = [
  {
    method: 'GET',
    path: '/',
    config: {
      handler: (request, reply) => {
        reply('Welcome to Spout360 API');
      },
      description: 'Home',
      tags: ['api']
    }
  }
];

