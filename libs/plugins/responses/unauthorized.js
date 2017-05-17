module.exports = {
  method: 'unauthorized',

  /**
   * Method handler for unauthorized response
   *
   * @param {Object} data
   * @return {Object}
   */
  handler(data = {}) {
    this.request.log('error', data);

    const {
      message = 'Unauthorized'
    } = data;

    const error = {
      error: {
        message
      }
    };

    const res = this.response(error);
    res.statusCode = 401;

    return res;
  }
};
