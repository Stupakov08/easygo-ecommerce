const authServices = require('../../services/auth');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const mongoose = require('mongoose');
const {
  InvalidCredentialsError,
  EmailIsAlreadyTakenError,
} = require('../../errors');
const { v4: uuidv4 } = require('uuid');

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

describe('signUp', () => {
  it('adds new user and return valid tokens', () => {
    expect.assertions(2);
    return authServices
      .signUp({
        email: `${uuidv4().slice(0, 8)}_stupakov@gmail.com`,
        password: 'myPassword',
        passwordconf: 'myPassword',
        fingerprint: 'abcd',
        name: 'Vova',
      })
      .then(({ accessToken, refreshToken }) => {
        refreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
        accessToken = jwt.verify(accessToken, process.env.JWT_SECRET_ACCESS);

        expect(typeof refreshToken.id).toBe('string');
        expect(typeof accessToken.userId).toBe('string');
      });
  });

  it('handle exist email and throw EmailIsAlreadyTakenError', () => {
    expect.assertions(1);

    return authServices
      .signUp({
        email: 'stupakov08@gmail.com',
        password: 'myPassword',
        passwordconf: 'myPassword',
        fingerprint: 'abcd',
        name: 'Vova',
      })
      .catch(err => {
        expect(err instanceof EmailIsAlreadyTakenError).toBe(true);
      });
  });
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
  it('drop all user sessions if he login on 5 device', () => {});
  it('delete session with the same fingerprint', () => {});
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
