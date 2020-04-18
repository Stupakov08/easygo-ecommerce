const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models').User;

const signIn = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: 'User does not exist!' });
      }

      const isValid = bcrypt.compareSync(password, user.password);
      if (isValid) {
        const token = jwt.sign(user._id.toString(), process.env.JWT_SECRET);
        return res.json({ token });
      } else {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

module.exports = {
  signIn,
};
