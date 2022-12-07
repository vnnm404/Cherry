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
});

app.listen(PORT, () => {
  console.log(`Live on ${PORT}`);
});