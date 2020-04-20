const mongoose = require('mongoose');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { tokens } = require('../config/app').jwt;
const { v4: uuidv4 } = require('uuid');

const tokenSchema = new mongoose.Schema({
  tokenId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

tokenSchema.statics.updateTokens = (userId) => {
  const Token = mongoose.model('Token', tokenSchema);

  const accessToken = Token.generateAccessToken(userId);
  const refreshToken = Token.generateRefreshToken();

  return Token.replaceRefreshToken(refreshToken.id, userId).then(() => {
    return {
      accessToken,
      refreshToken: refreshToken.token,
    };
  });
};

tokenSchema.statics.replaceRefreshToken = (tokenId, userId) => {
  const Token = mongoose.model('Token', tokenSchema);
  return Token.deleteMany({ userId })
    .exec()
    .then(() => Token.create({ tokenId, userId }));
};

tokenSchema.statics.generateRefreshToken = () => {
  const payload = {
    id: uuidv4(),
    type: tokens.refresh.type,
  };
  const options = {
    expiresIn: tokens.refresh.expiresIn,
  };
  return {
    id: payload.id,
    token: jwt.sign(payload, process.env.JWT_SECRET_REFRESH, options),
  };
};

tokenSchema.statics.generateAccessToken = (userId) => {
  const payload = {
    userId,
    type: tokens.access.type,
  };
  const options = { expiresIn: tokens.access.expiresIn };

  return jwt.sign(payload, process.env.JWT_SECRET_ACCESS, options);
};

tokenSchema.statics.verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_ACCESS);
};
tokenSchema.statics.verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_REFRESH);
};

module.exports = mongoose.model('Token', tokenSchema);
