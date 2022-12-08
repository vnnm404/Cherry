import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const PORT = 5500;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('./src/public'));
app.set('view engine', 'ejs');
app.set('views', './src/views');


app.get('/', (req, res) => {
  res.render('index');
});

io.on('connection', socket => {
  console.log(`User[${socket.id}]: connected`);

  socket.on('move', moveStr => {
    // console.log(`User[${socket.id}]: sent: ${moveStr}`);

    /*
      valid move = validateMove(moveStr);

      if valid move:
        // success
        socket.emit('validated', 1);
      else:
        // failure
        socket.emit('validated', 0);

    */
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