'use strict';

// !NOTE: this is here just for the testing session

//environment variables
const dotenv = require('dotenv');
dotenv.config({ path: './../../.env' });

// !NOTE: END

const mongoose = require('mongoose');
module.exports.connectionString = String(
  process.env.MONGODB_URL + process.env.MONGODB_DATABASE_NAME
);

mongoose.connect(this.connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports.db = mongoose;

require('./../../models/lobbyModel');
require('./../../models/userModel');
