'use strict';

//reders the views

module.exports = function (viewName) {
  return function (req, res) {
    res.render(viewName, res.locals);
  };
};
