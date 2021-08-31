// Capitalises the first letter of a string
module.exports.capitalize = function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
