const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const routes = require('./routes');
const authMiddleware = require('./middlewares/auth');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const clientUrl = require('./config/app').clientUrl;
const adminUrl = 'http://localhost:3001';
const app = express();

//middlewares
app.use(
  cors({
    origin: [clientUrl, adminUrl],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb', extended: true }));

app.use(express.static('static'));
app.use('/static', express.static('static'));

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
