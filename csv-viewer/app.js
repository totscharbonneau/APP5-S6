const express = require('express');
const path = require('path');
const csvRouter = require('./routes/csv');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/csv', csvRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
