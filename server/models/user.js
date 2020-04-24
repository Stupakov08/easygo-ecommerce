const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

userSchema
  .virtual('password')
  .set(function (password) {
    this.password_hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  })
  .get(function () {
    return this.password_hash;
  });

userSchema.methods = {
  comparePassword: password => {
    bcrypt.compareSync(password, this.password_hash);
  },
};

module.exports = mongoose.model('User', userSchema);
