'use strict';

//---------------------------------
//  IMPORTS
//---------------------------------

// common middlewares
const renderMW = require('../middlewares/common/renderMW');

// middlewares that do the authentication
const authMW = require('../middlewares/webauth/authMW');
const loginMW = require('../middlewares/webauth/loginMW');
const logoutMW = require('../middlewares/webauth/logoutMW');
const registerMW = require('../middlewares/webauth/registerMW');

// middlewares for manipulating the lobby
const createLobbyMW = require('../middlewares/lobby/createLobbyMW');
const destroyLobbyMW = require('../middlewares/lobby/destroyLobbyMW');
const joinLobbyMW = require('../middlewares/lobby/joinLobbyMW');
const leaveLobbyMW = require('../middlewares/lobby/leaveLobbyMW');

// game logic middlewares

// pregame
const randomRoleMW = require('../middlewares/game/pregame/randomRoleMW');
const showRoleMW = require('../middlewares/game/pregame/showRoleMW');

// midgame
const adventureMW = require('../middlewares/game/midgame/adventureMW');
const checkScoreMW = require('../middlewares/game/midgame/checkScoreMW');
const selectMW = require('../middlewares/game/midgame/selectMW');
const voteMW = require('../middlewares/game/midgame/voteMW');

//endgame
const assassinGuessMW = require('../middlewares/game/endgame/assassinGuessMW');
const assassinRedirectMW = require('../middlewares/game/endgame/assassinRedirectMW');
const passport = require('passport');

//---------------------------------
//  LOCAL SERVICES
//---------------------------------

function getCurrentPath() {
  let path = String(__dirname);
  path = path.replace('routes', '');
  return path;
}

//---------------------------------
//  ROUTES
//---------------------------------
module.exports = function (app) {
  // The main page. Login form
  app.get(
    '/',
    /*(req, res, next) => {
      if (req.session.viewcount) {
        req.session.viewcount++;
      } else {
        req.session.viewcount = 1;
      }
      console.log(req);
      res.send(
        `<h1>You have visited this site: ${req.session.viewcount} times.</h1>`
      );
    }*/
    renderMW('login.html')
  );

  // This is where the user credential verification happens
  app.post(
    '/',
    (req, res, next) => {
      console.log(req.body);
      console.log(res.body);
      return next();
    },
    passport.authenticate('local', {
      failureRedirect: '/login-faliure',
      successRedirect: '/login-success',
    })
  );

  app.get('/login-success', loginMW());

  app.get('/login-faliure', (req, res, next) => {
    res.send('<h1>Username or password is not correct! Try again!</h1>');
  });

  app.get('/register', renderMW('register.html'));

  app.post('/register', registerMW());

  // TODO homepage instead of login page
  // The home page after logging in
  app.get('/avalon', authMW(), renderMW('home.html'));

  // The action of making a new lobby and automatically joining after
  app.get(
    '/avalon/join/new',
    authMW(),
    createLobbyMW(),
    joinLobbyMW(),
    renderMW('lobby.html')
  );

  // TODO decide if it should be POST or USE or it could also be get if the lobby id is provided

  // joining an existing lobby or redirecting to the home page
  app.get(
    '/avalon/join/:lobby_id',
    authMW(),
    joinLobbyMW(),
    renderMW('lobby.html')
  );

  // TODO because of the nicknames the request should be post to get the data but first we need a get to show the full lobby or we could do a post on /avalon/lobby

  /* starting the game:
        - randomizing roles
        - redirecting to the characters page      
  */
  app.get('/avalon/game/start', authMW(), randomRoleMW(), showRoleMW());

  // show the character role

  app.get(
    '/avalon/game/character',
    authMW(),
    showRoleMW(),
    renderMW('character.html')
  );

  // the selection page
  app.get('/avalon/game/select', authMW(), renderMW('select.html'));

  // getting the selected people
  app.post('/avalon/game/select', authMW(), selectMW());

  // showing the voting tab

  //TODO might be better to have a pop up
  app.get('/avalon/game/voting', authMW(), renderMW('voting.html'));

  // getting the result of the vote
  app.post('/avalon/game/voting', authMW(), voteMW());

  // only for those who are going on the adventure : voting , for everyone else the scores show
  app.get(
    '/avalon/game/adventure',
    authMW(),
    adventureMW(),
    renderMW('voting.html')
  );

  //getting the results of the adventure
  app.post(
    '/avalon/game/adventure',
    authMW(),
    adventureMW(),
    voteMW(),
    checkScoreMW()
  );

  // the assassins guess selection page
  app.get(
    '/avalon/game/assassin',
    authMW(),
    assassinRedirectMW(),
    renderMW('select.html')
  );

  // the result of the guess
  app.post(
    '/avalon/game/assassin',
    authMW(),
    assassinRedirectMW(),
    assassinGuessMW()
  );

  //just the game score
  app.get('/avalon/game', authMW(), checkScoreMW(), renderMW('gamescore.html'));

  //RESOURCES

  //style.css
  app.get('/resources/style', function (req, res, next) {
    res.sendFile(getCurrentPath() + 'views/static/css/style.css');
  });

  //bootstrap.min.css
  app.get('/resources/bootstrap', function (req, res, next) {
    res.sendFile(getCurrentPath() + 'views/static/css/bootstrap.min.css');
  });

  //login.css
  app.get('/resources/login', function (req, res, next) {
    res.sendFile(getCurrentPath() + 'views/static/css/login.css');
  });
};
