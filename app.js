const express = require('express');
const app = express();
const port = 3001;
const connect = require('./schemas/index');
connect();

const productRouter = require('./routes/product.router');

app.use(express.json());
app.use('/api', [productRouter]);

//작동 확인.
app.get('/', (req, res) => {
  res.send('hello world!');
});

app.listen(port, () => {
  console.log('포트가 열렸어요!');
});
