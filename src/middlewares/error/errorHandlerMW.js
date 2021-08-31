'use strict';

// For handling the errors
// TODO make a page for Something went wrong and differenciate ApiErrors and other errors
module.exports = function (err, req, res, next) {
  console.log(err);
  return res.send(
    '<h1>Something went wrong!</h1> <h5>' + err.message + '</h5>'
  );
};
