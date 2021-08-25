'use strict';

const { redirect } = require('express/lib/response');

// checks the lobby code if the code is correct redirect to the lobby

module.exports = function () {
  return function (req, res, next) {
    if (typeof req.body.lobby_code === 'undefined') {
      return redirect('/');
    }

    let code = req.body.lobby_code;

    return res.redirect('/join/' + code);
  };
};
