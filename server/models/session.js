const mongoose = require('mongoose');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { tokens, numberOfSessions } = require('../config/app').jwt;
const { v4: uuidv4 } = require('uuid');
const { TokenExpiredError, TokenInvalidError } = require('../helpers/errors');

const sessionSchema = new mongoose.Schema(
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

sessionSchema.statics.dropAllUserSessions = userId => {
  return Session.deleteMany({ userId });
};

sessionSchema.statics.addSession = async (userId, fingerprint) => {
  const userSessions = await Session.find({ userId }).exec();
  if (userSessions.length > numberOfSessions)
    Session.dropAllUserSessions(userId);

  const accessToken = Session.generateAccessToken(userId);
  const refreshToken = Session.generateRefreshToken();

  await Session.create({ tokenId: refreshToken.id, userId, fingerprint });
  return { accessToken, refreshToken: refreshToken.token };
};

sessionSchema.statics.generateRefreshToken = () => {
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

sessionSchema.statics.generateAccessToken = userId => {
  const payload = {
    userId,
    type: tokens.access.type,
  };
  const options = { expiresIn: tokens.access.expiresIn };

  return jwt.sign(payload, process.env.JWT_SECRET_ACCESS, options);
};

sessionSchema.statics.verifyAccessToken = token => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_ACCESS);
  } catch (e) {
    throw e instanceof jwt.TokenExpiredError
      ? new TokenExpiredError()
      : new TokenInvalidError();
  }
};

sessionSchema.statics.verifyRefreshToken = token => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_REFRESH);
  } catch (e) {
    throw e instanceof jwt.TokenExpiredError
      ? new TokenExpiredError()
      : new TokenInvalidError();
  }
};

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;