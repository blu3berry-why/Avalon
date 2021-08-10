// checks if the person went on the adventure if not redirects to /avalon/game/adventure/?staying

module.exports = function () {
  return function (req, res, next) {
    return next();
  };
};
