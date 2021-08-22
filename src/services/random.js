'use strict';

// A random 6 character long string

function sixCharStr() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * 36));
  }
  return result.toUpperCase();
}

module.exports.sixCharStr = sixCharStr;
