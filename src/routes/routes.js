//---------------------------------
//  IMPORTS
//---------------------------------

// common middlewares
const renderMW = require('../middlewares/common/renderMW');

// middlewares that do the authentication
const authMW = require('../middlewares/webauth/authMW');
const loginMW = require('../middlewares/webauth/loginMW');
const logoutMW = require('../middlewares/webauth/logoutMW');

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

//---------------------------------
//  ROUTES
//---------------------------------
module.exports = function (app) {
  // The main page. Login form
  app.get('/', renderMW('login.html'));

  // This is where the user credential verification happens
  app.post('/', loginMW());

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
};
