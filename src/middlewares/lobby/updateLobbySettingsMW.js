'use strict';

module.exports = function () {
  return function (req, res, next) {
    const route = '/join/' + req.params.lobby_id;
    return res.redirect(route);
  };
};
