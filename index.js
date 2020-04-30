const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const routes = require('./routes');
const authMiddleware = require('./middlewares/auth');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const clientUrl = require('./config/app').clientUrl;

const app = express();

//middlewares
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(bodyParser.json());

//routes
app.use('/api', routes);

app.post('/api/check', authMiddleware, (req, res) => {
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
  .catch(err => console.log(`Database connection error ${err}`));

//running
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on ${port} port`);
});
