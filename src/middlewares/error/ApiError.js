'use strict';

class ApiError {
  constructor(code, message) {
    this.message = message;
    this.code = code;
  }

  static internal(msg) {
    return new ApiError(500, msg);
  }
}

module.exports = ApiError;
