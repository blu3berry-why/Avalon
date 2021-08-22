'use strict';

// getting environment variables from the .env file
const dotenv = require('dotenv');

dotenv.config();
//console.log(process.env);

// mongodb database
const db = require('./src/config/MongoDB/mongodb');

//setting up express
const express = require('express');
let app = express();

app.use(express.json());

// !QUESTION: what does urlencoded options extenden mean?
// with extended: true the post requests did not work
app.use(express.urlencoded({ extended: false }));

app.use(express.static('/src/views/static'));

//connect mongo
const MongoStore = require('connect-mongo');

// express-session
const session = require('express-session');
const passport = require('passport');
app.use(
  session({
    secret: 'keyboard-cat',
    resave: false,
    store: MongoStore.create({
      mongoUrl: db.connectionString,
    }),
    saveUninitialized: true,
    cookie: {
      //secure: true,
      // 1 day
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(express.static(__dirname + '/src/views/static'));
app.set('views', __dirname + '/src/views/static');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

require('./src/config/passport');

app.use(passport.initialize());
app.use(passport.session());

// loading routes
require('./src/routes/routes.js')(app);

const port = process.env.PORT || 5000;

let server = app.listen(port, function () {
  console.log('Listening on port : ' + port);
});
