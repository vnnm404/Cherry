import { fileURLToPath } from 'url';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { chessMoveValidate, chessMakeMove } from './lib/chessutils.js';
import { matches, findMatch } from './lib/matchmaking.js';
import { authenticateUser, signupUser } from './lib/auth.js';

const PORT = process.env.PORT || 5500;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.dirname(__filename) + '/public'));
app.set('view engine', 'ejs');
app.set('views', path.dirname(__filename) + '/views');
app.get('/', (req, res) => {
  res.render('index');
});

io.on('connection', socket => {
  // console.log(`User[${socket.id}]: connected`);
  findMatch(socket);
  socket.on('move', (matchId, fromCoords, toCoords) => {

    // console.log(`User[${socket.id}]: sent: ${fromCoords.x} ${fromCoords.y} || ${toCoords.x} ${toCoords.y}`);

    // console.log('Validating: ' + matches[matchId].boardState[fromCoords.y][fromCoords.x]);

    let valid = chessMoveValidate(
      matches[matchId].boardState,
      fromCoords, toCoords,
      matches[matchId].turnState
    );

    // console.log(matches[matchId].turnState + ': move validated to be: ' + valid);

    let sentBoard = matches[matchId].boardState.map((arr) => { return arr.slice(); });
    if (valid) {
      chessMakeMove(matches[matchId], fromCoords, toCoords);
      sentBoard = matches[matchId].boardState.map((arr) => { return arr.slice(); });
      sentBoard[fromCoords.y][fromCoords.x] |= 0b10000; // move indicators
      sentBoard[toCoords.y][toCoords.x] |= 0b10000;
    }

    matches[matchId].player1Socket.emit('validated', sentBoard, matches[matchId].turnState);
    matches[matchId].player2Socket.emit('validated', sentBoard, matches[matchId].turnState);
  });

  socket.on('auth', ({ username, password }) => {
    // console.log(`User[${socket.id}]: auth with [${username}, ${password}]`);

    let r = authenticateUser(username, password);
    socket.emit('auth', r);
  });

  socket.on('signup', ({ username, password }) => {
    // console.log(`User[${socket.id}]: signup with [${username}, ${password}]`);

    let r = signupUser(username, password);
    socket.emit('signup', r);
  });

  socket.on('disconnect', () => {
    // console.log(`User[${socket.id}]: disconnected`);
  });
});

server.listen(PORT, () => {
  console.log(`Live on ${PORT}`);
});
