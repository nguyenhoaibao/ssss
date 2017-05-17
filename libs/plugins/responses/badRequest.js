module.exports = {
  method: 'badRequest',

  /**
   * Method handler for bad request response
   *
   * @param {object} data
   * @return {Object}
   */
  handler(data) {
    this.request.log('info', data);

    const {
      message = 'Bad Request'
    } = data;

    const error = {
      error: {
        message
      }
    };

    const res = this.response(error);
    res.statusCode = 400;

    return res;
  }
};
