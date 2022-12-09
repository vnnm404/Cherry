import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import { chessMoveValidate } from './helpers/validator.js';

const PORT = 5500;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('./src/public'));
app.set('view engine', 'ejs');
app.set('views', './src/views');


let boardState = [[12, 14, 13, 11, 10, 13, 14, 12],
                    [9, 9, 9, 9, 9, 9, 9, 9],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [1, 1, 1, 1, 1, 1, 1, 1],
                    [4, 6, 5, 3, 2, 5, 6, 4]];
let turnState = 0;


app.get('/', (req, res) => {
  res.render('index');
});

io.on('connection', socket => {
  console.log(`User[${socket.id}]: connected`);
  turnState = 0;
  boardState = [[12, 14, 13, 11, 10, 13, 14, 12],
                    [9, 9, 9, 9, 9, 9, 9, 9],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [1, 1, 1, 1, 1, 1, 1, 1],
                    [4, 6, 5, 3, 2, 5, 6, 4]];
  socket.on('move', (fromCoords, toCoords) => {
    console.log(`User[${socket.id}]: sent: ${fromCoords.x} ${fromCoords.y} || ${toCoords.x} ${toCoords.y}`);

    /*
      valid move = validateMove(board, move_from, move_to, turn (black or white));

      if valid move:
        // success
        socket.emit('validated', 1);
      else:
        // failure
        socket.emit('validated', 0);

    */

    // console.log('turn ::: ' + turnState);
    console.log('Validating: ' + boardState[fromCoords.y][fromCoords.x]);

    let valid = chessMoveValidate(boardState, fromCoords, toCoords, turnState);
    console.log(turnState + ': Move validated to be:: ' + valid);

    if (valid) {
      boardState[toCoords.y][toCoords.x] = boardState[fromCoords.y][fromCoords.x];
      boardState[fromCoords.y][fromCoords.x] = 0;
      turnState = 1 - turnState;
      socket.emit('validated', 1);
    } else {
      socket.emit('validated', 0);
    }
  });

  socket.on('auth', ({ username, password }) => {
    console.log(`User[${socket.id}]: auth with [${username}, ${password}]`);

    /*
      if (authenticateUser(username, password)) {
        socket.emit('auth', 1);
      } else {
        socket.emit('auth', 0);
      }
    */
  });

  socket.on('disconnect', () => {
    console.log(`User[${socket.id}]: disconnected`);
  });
});

server.listen(PORT, () => {
  console.log(`Live on ${PORT}`);
});