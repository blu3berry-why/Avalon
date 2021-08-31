'use strict';

//This is an error class for identifing the expected and the not expected errors

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
