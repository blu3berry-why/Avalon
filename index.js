// getting environment variables from the .env file
const dotenv = require('dotenv');

dotenv.config();
console.log(process.env);

//setting up express
const express = require('express');
let app = express();

const port = process.env.PORT || 5000;

let server = app.listen(port, function () {
  console.log('Listening on port : ' + port);
});
