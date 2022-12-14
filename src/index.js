import { fileURLToPath } from 'url';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { chessMakeMove, checkLegalMove, checkMateCheck } from './lib/chessutils.js';
import { matches, findMatch, initMatch, findPrivateMatch } from './lib/matchmaking.js';
import { authenticateUser, signupUser } from './lib/auth.js';

// express server
const PORT = process.env.PORT || 5500;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

/*
user database, convert this to an actual database
user: { username, password, sessions }
sessions = [<session>]

session:
  id: sessionID,
  expires: expirationDate
*/
let users = [];

// set up express settings, use ejs for templating
app.use(express.static(path.dirname(__filename) + '/public'));
app.set('view engine', 'ejs');
app.set('views', path.dirname(__filename) + '/views');

// routes
app.get('/', (req, res) => {
  res.redirect('/index');
});

app.get('/index', (req, res) => {
  res.render('index');
});

app.get('/game', (req, res) => {
  let matchId = req.query.matchId;
  res.render('game', {
    matchId: matchId ?? ""
  });
});

// socket.io server
io.on('connection', socket => {
  // this route validates a move sent by a player
  socket.on('move', (matchId, fromCoords, toCoords) => {

    // authenticating move
    let valid = checkLegalMove(
      matches[matchId].boardState,
      fromCoords, toCoords,
      matches[matchId].turnState
    );

    let sentBoard = matches[matchId].boardState.map((arr) => { return arr.slice(); });
    if (valid) {
      chessMakeMove(matches[matchId], fromCoords, toCoords);
      sentBoard = matches[matchId].boardState.map((arr) => { return arr.slice(); });
      sentBoard[fromCoords.y][fromCoords.x] |= 0b10000; // move indicators
      sentBoard[toCoords.y][toCoords.x] |= 0b10000;
    }

    matches[matchId].player1Socket.emit('validated', sentBoard, matches[matchId].turnState);
    matches[matchId].player2Socket.emit('validated', sentBoard, matches[matchId].turnState);

    // check if game over
    if(checkMateCheck(matches[matchId].boardState, matches[matchId].turnState)){
      matches[matchId].player1Socket.emit('checkMate', matches[matchId].turnState);
      matches[matchId].player2Socket.emit('checkMate', matches[matchId].turnState);
    }
  });

  // this route signs in a user
  socket.on('signin', ({ username, password }) => {
    let [r, sessionID] = authenticateUser(users, username, password);
    socket.emit('signin', r, sessionID);
  });

  // this route signs up a user
  socket.on('signup', ({ username, password }) => {
    // console.log(`User[${socket.id}]: signup with [${username}, ${password}]`);

    let r = signupUser(users, username, password);
    socket.emit('signup', r);
  });

  // this route authenticates a user with a sessionID
  socket.on('auth', (sessionID, matchId) => {
    if (matchId === null) {
      // regular match making
      findMatch(socket);
    } else {
      findPrivateMatch(socket, matchId); // if func returns 0, no private match exists with that matchID (invalid link)
    }
    // use sessionID to identify the user
    // if sessionID is undefined, then the user plays as a guest
  });

  // this route generates a private match on demand
  socket.on('private-match', arg => {
    // generate link here and init new match
    let maxMatchId = -1;
    for(let match of matches) {
      if (match.matchId > maxMatchId) {
        maxMatchId = match.matchId;
      }
    }

    let privateMatch = initMatch(maxMatchId + 1, null);
    privateMatch.private = true;

    matches.push(privateMatch);

    socket.emit('private-match', privateMatch.matchId);
  });

  // thie route is fired when a socket disconnects
  socket.on('disconnect', () => {
    // console.log(`User[${socket.id}]: disconnected`);
  });
});

// start the server
server.listen(PORT, () => {
  console.log(`Live on ${PORT}`);
});
