const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const authRouter = require('./routes/auth');
const authMiddleware = require('./middlewares/auth');

const app = express();

//middlewares
app.use(bodyParser.json());

//routes
app.use('/api', authRouter);

app.post('/check', authMiddleware, (req, res) => {
  console.log(req.body);
  res.status(200).json(req.body);
});

//database
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`Database connected`))
  .catch((err) => console.log(`Database connection error ${err}`));

//running
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on ${port} port`);
});
