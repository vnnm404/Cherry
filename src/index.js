import express from 'express';

const app = express();
const port = 5500;

app.use(express.static('./public'));

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.listen(port, () => {
  console.log(`Live on ${port}`);
});