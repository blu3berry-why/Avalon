'use strict';

// getting environment variables from the .env file
const dotenv = require('dotenv');

dotenv.config();
//console.log(process.env); 

//setting up express
const express = require('express');
let app = express();

app.use(express.static('/src/views/static'));

app.use(express.static(__dirname + '/src/views/static'));
app.set('views', __dirname + '/src/views/static');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
// loading routes
require('./src/routes/routes.js')(app);

const port = process.env.PORT || 5000;

let server = app.listen(port, function () {
  console.log('Listening on port : ' + port);
});
