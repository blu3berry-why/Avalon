'use strict';

// !NOTE: this is here just for the testing session

//environment variables
const dotenv = require('dotenv');
dotenv.config({ path: './../../.env' });

// !NOTE: END

const mongoose = require('mongoose');

let connectionStr;
if (process.env.PRODUCTION) {
  connectionStr = process.env.DB_CONNECTION_STRING;
} else {
  connectionStr = String(
    process.env.MONGODB_URL + process.env.MONGODB_DATABASE_NAME
  );
}
module.exports.connectionString = connectionStr;

mongoose.connect(this.connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports.db = mongoose;

require('./../../models/lobbyModel');
require('./../../models/userModel');
