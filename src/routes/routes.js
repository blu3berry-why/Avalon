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
const updateLobbySettingsMW = require('../middlewares/lobby/updateLobbySettingsMW');

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
  app.get('/login', renderMW('login.html'));

  // This is where the user credential verification happens
  app.post(
    '/login',
    passport.authenticate('local', {
      failureRedirect: '/login-faliure',
      successRedirect: '/login-success',
    })
  );

  // This is called when passport authentication is a success
  app.get('/login-success', loginMW());

  // This route is used when the passport authenticatioun fails
  app.get('/login-faliure', (req, res, next) => {
    res.send('<h1>Username or password is not correct! Try again!</h1>');
  });

  //registration
  // TODO make a better register page
  app.get('/register', renderMW('register.html'));
  app.post('/register', registerMW());

  // Logging out and deleting the session
  app.get('/logout', logoutMW());

  // The action of making a new lobby and redirecting to the joining route
  app.get('/join/new', authMW(), createLobbyMW());

  //TODO to make settings.html and a GET and POST request and a Middlewware for it!
  app.get('/join/:lobby_id/settings', renderMW('lobbysettings.html'));

  app.post('/join/:lobby_id/settings', updateLobbySettingsMW());

  // TODO decide if it should be POST or USE or it could also be get if the lobby id is provided

  // joining an existing lobby or redirecting to the home page
  app.get('/join/:lobby_id', authMW(), joinLobbyMW(), renderMW('lobby.html'));

  // TODO because of the nicknames the request should be post to get the data but first we need a get to show the full lobby or we could do a post on /avalon/lobby

  /* starting the game:
        - randomizing roles
        - redirecting to the characters page      
  */
  app.get('/game/start', authMW(), randomRoleMW(), showRoleMW());

  // show the character role

  app.get(
    '/game/character',
    authMW(),
    showRoleMW(),
    renderMW('character.html')
  );

  // the selection page
  app.get('/game/select', authMW(), renderMW('select.html'));

  // getting the selected people
  app.post('/game/select', authMW(), selectMW());

  // showing the voting tab

  //TODO might be better to have a pop up
  app.get('/game/voting', authMW(), renderMW('voting.html'));

  // getting the result of the vote
  app.post('/game/voting', authMW(), voteMW());

  // only for those who are going on the adventure : voting , for everyone else the scores show
  app.get('/game/adventure', authMW(), adventureMW(), renderMW('voting.html'));

  //getting the results of the adventure
  app.post(
    '/game/adventure',
    authMW(),
    adventureMW(),
    voteMW(),
    checkScoreMW()
  );

  // the assassins guess selection page
  app.get(
    '/game/assassin',
    authMW(),
    assassinRedirectMW(),
    renderMW('select.html')
  );

  // the result of the guess
  app.post('/game/assassin', authMW(), assassinRedirectMW(), assassinGuessMW());

  //just the game score
  app.get('/game', authMW(), checkScoreMW(), renderMW('gamescore.html'));

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

  // TODO homepage instead of login page
  // The home page after logging in
  app.get('/', authMW(), renderMW('home.html'));

  //any other literal that does not match the others
  app.get('/*', (req, res, next) => {
    res.redirect('/');
  });
};
