const mongoose = require('mongoose');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { tokens, numberOfSessions } = require('../../config/app').jwt;
const { v4: uuidv4 } = require('uuid');
const { TokenExpiredError, TokenInvalidError } = require('../../errors');

const adminSessionSchema = new mongoose.Schema(
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

adminSessionSchema.statics = {
  dropAllUserSessions: userId => {
    return AdminSession.deleteMany({ userId });
  },

  addSession: async (user, fingerprint) => {
    const userId = user._id;
    const userSessions = await AdminSession.find({ userId }).exec();

    userSessions.length > numberOfSessions &&
      AdminSession.dropAllUserSessions(userId);

    await AdminSession.deleteMany({ userId, fingerprint }).exec();

    const accessToken = AdminSession.generateAccessToken({
      userId,
      email: user.email,
      superadmin: user.superadmin,
    });
    const refreshToken = AdminSession.generateRefreshToken();

    await AdminSession.create({
      tokenId: refreshToken.id,
      userId,
      fingerprint,
    });
    return { accessToken, refreshToken: refreshToken.token };
  },

  generateRefreshToken: () => {
    const payload = {
      id: uuidv4(),
      type: tokens.refresh.type,
    };
    const options = {
      expiresIn: '60m',
    };
    return {
      id: payload.id,
      token: jwt.sign(payload, process.env.JWT_SECRET_REFRESH, options),
    };
  },

  generateAccessToken: payload => {
    const data = {
      payload,
      type: tokens.access.type,
    };
    const options = { expiresIn: '30m' };

    return jwt.sign(data, process.env.JWT_SECRET_ACCESS, options);
  },

  verifyAccessToken: token => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET_ACCESS);
    } catch (e) {
      throw e instanceof jwt.TokenExpiredError
        ? new TokenExpiredError()
        : new TokenInvalidError();
    }
  },

  verifyRefreshToken: token => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET_REFRESH);
    } catch (e) {
      throw e instanceof jwt.TokenExpiredError
        ? new TokenExpiredError()
        : new TokenInvalidError();
    }
  },
};

const AdminSession = mongoose.model('AdminSession', adminSessionSchema);

module.exports = AdminSession;
