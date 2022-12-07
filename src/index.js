const express = require('express');
var path = require('path');

const app = express();
const port = 5500;

app.use(express.static('./public'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, () => {
  console.log(`Live on ${port}`);
});