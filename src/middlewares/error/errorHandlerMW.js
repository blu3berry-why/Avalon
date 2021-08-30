'use strict';

module.exports = function (err, req, res, next) {
  console.log(err);
  return res.send(
    '<h1>Something went wrong!</h1> <h5>' + err.message + '</h5>'
  );
};
