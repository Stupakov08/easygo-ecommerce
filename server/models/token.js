const mongoose = require('mongoose');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { tokens, numberOfSessions } = require('../config/app').jwt;
const { v4: uuidv4 } = require('uuid');
const { TokenExpiredError, TokenInvalidError } = require('../helpers/errors');

const tokenSchema = new mongoose.Schema(
  {
    tokenId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    fingerprint: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

tokenSchema.statics.dropAllUserSessions = userId => {
  return Token.deleteMany({ userId });
};

tokenSchema.statics.addSession = async (userId, fingerprint) => {
  const userSessions = await Token.find({ userId }).exec();
  if (userSessions.length > numberOfSessions) Token.dropAllUserSessions(userId);

  const accessToken = Token.generateAccessToken(userId);
  const refreshToken = Token.generateRefreshToken();

  await Token.create({ tokenId: refreshToken.id, userId, fingerprint });
  return { accessToken, refreshToken: refreshToken.token };
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

tokenSchema.statics.generateAccessToken = userId => {
  const payload = {
    userId,
    type: tokens.access.type,
  };
  const options = { expiresIn: tokens.access.expiresIn };

  return jwt.sign(payload, process.env.JWT_SECRET_ACCESS, options);
};

tokenSchema.statics.verifyAccessToken = token => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_ACCESS);
  } catch (e) {
    throw e instanceof jwt.TokenExpiredError
      ? new TokenExpiredError()
      : new TokenInvalidError();
  }
};

tokenSchema.statics.verifyRefreshToken = token => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_REFRESH);
  } catch (e) {
    throw e instanceof jwt.TokenExpiredError
      ? new TokenExpiredError()
      : new TokenInvalidError();
  }
};

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
