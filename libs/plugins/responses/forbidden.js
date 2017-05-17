module.exports = {
  method: 'forbidden',

  /**
   * Method handler for bad request response
   *
   * @param {object} data
   * @return {Object}
   */
  handler(data = {}) {
    this.request.log('info', data);

    const {
      message = 'Forbidden'
    } = data;

    const error = {
      error: {
        message
      }
    };

    const res = this.response(error);
    res.statusCode = 403;

    return res;
  }
};
