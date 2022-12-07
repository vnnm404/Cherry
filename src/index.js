const express = require('express');
var path = require('path');

const PORT = 5500;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('./public'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
  res.render('index');
});

io.on('connection', socket => {
  console.log(`User[${socket.id}]: connected`);
});

app.listen(PORT, () => {
  console.log(`Live on ${PORT}`);
});