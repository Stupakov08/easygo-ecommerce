const authServices = require('../../services/auth');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const mongoose = require('mongoose');
const { InvalidCredentialsError } = require('../../helpers/errors');
const Session = require('../../models/session');

beforeAll(async () => {
  await mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('signIn', () => {
  it('returns valid jwt tokens', () => {
    expect.assertions(2);
    return authServices
      .signIn({
        email: 'stupakov08@gmail.com',
        password: 'myPassword',
        fingerprint: 'abc',
      })
      .then(({ accessToken, refreshToken }) => {
        refreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
        accessToken = jwt.verify(accessToken, process.env.JWT_SECRET_ACCESS);

        expect(typeof refreshToken.id).toBe('string');
        expect(typeof accessToken.userId).toBe('string');
      });
  });

  it('handle invalid creds and return InvalidCredentialsError', () => {
    expect.assertions(1);

    return authServices
      .signIn({
        email: 'stupakov08@gmail.com',
        password: 'myPassword12',
        fingerprint: 'abc',
      })
      .catch(err => {
        expect(err instanceof InvalidCredentialsError).toBe(true);
      });
  });
});

describe('refreshToken', () => {
  it('returns valid jwt tokens', () => {
    expect.assertions(2);

    const mockedUserId = 'mockeduserid';
    const mockedFingerPrint = 'mockedfingerprint';

    return Session.addSession(mockedUserId, mockedFingerPrint)
      .then(({ refreshToken }) =>
        authServices.refreshTokens(refreshToken, mockedFingerPrint),
      )
      .then(({ accessToken, refreshToken }) => {
        refreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
        accessToken = jwt.verify(accessToken, process.env.JWT_SECRET_ACCESS);

        expect(typeof refreshToken.id).toBe('string');
        expect(typeof accessToken.userId).toBe('string');
      });
  });
});
