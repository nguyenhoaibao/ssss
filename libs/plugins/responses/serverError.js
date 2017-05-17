module.exports = {
  method: 'serverError',

  /**
   * Method handler for server error response
   *
   * @param {Object} data
   * @return {Object}
   */
  handler(data = {}) {
    this.request.log('error', data);

    const {
      message = 'Internal Server Error'
    } = data;

    const error = {
      error: {
        message
      }
    };

    const res = this.response(error);
    res.statusCode = 500;

    return res;
  }
};
