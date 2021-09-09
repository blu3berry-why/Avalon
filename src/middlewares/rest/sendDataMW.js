'use strict';

module.exports = function () {
  return function (req, res, next) {
    res.locals.newData = 'Data';
    res.send(res.locals);
  };
};
