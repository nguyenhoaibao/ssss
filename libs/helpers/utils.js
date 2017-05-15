module.exports = {
  /**
   * Get environment variable by key
   *
   * @param {String} key
   * @param {String} [defaultValue='']
   * @return {String}
   */
  getEnv(key, defaultValue = '') {
    if (!key) {
      throw new Error('Key is required');
    }

    return process.env[key] || defaultValue;
  },

  /**
   * Get current NODE_ENV
   *
   * @return {String}
   */
  env() {
    return this.getEnv('NODE_ENV', 'development');
  },

  /**
   * Check to see swagger doc enabled or not
   *
   * @return {Bool}
   */
  isSwaggerDocEnabled() {
    return this.getEnv('SWAGGER_DOC') === 'enabled';
  }
};
