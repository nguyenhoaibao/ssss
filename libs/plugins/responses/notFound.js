module.exports = {
  method: 'notFound',

  /**
   * Method handler for not found response
   *
   * @param {Object} data
   * @return {Object}
   */
  handler(data = {}) {
    this.request.log('info', data);

    const {
      message = 'Not Found'
    } = data;

    const error = {
      error: {
        message
      }
    };

    const res = this.response(error);
    res.statusCode = 404;

    return res;
  }
};
