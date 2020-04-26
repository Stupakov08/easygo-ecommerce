const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { sendMail } = require('../helpers/mailer');
const jwt = require('jsonwebtoken');

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
    verified: {
      type: Boolean,
      default: false,
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
  comparePassword: function (password) {
    return bcrypt.compareSync(password, this.password_hash);
  },
  sendVerificationEmail: function () {
    const resetPasswordtoken = jwt.sign(
      { userId: this._id },
      process.env.JWT_SECRET_VERIFICATION,
      { expiresIn: '10m' },
    );

    const mailtemplate = require('../helpers/mailTemplates/verification.html');

    const template = mailtemplate.replace(
      /{{action_url}}/g,
      `http://localhost:8000/api/auth/verifyemail/${resetPasswordtoken}`,
    );

    return sendMail({
      email: this.email,
      subject: 'Verify your email',
      html: template,
    });
  },
};
userSchema.statics = {
  verifyVerificationEmailToken: function (token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET_VERIFICATION);
    } catch (e) {
      throw e instanceof jwt.TokenExpiredError
        ? new TokenExpiredError()
        : new TokenInvalidError();
    }
  },
  verifyUser: function (userId) {
    return User.updateOne({ _id: userId }, { $set: { verified: true } });
  },
};

const User = mongoose.model('User', userSchema);

module.exports = User;
