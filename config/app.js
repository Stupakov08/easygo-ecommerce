module.exports = {
  jwt: {
    tokens: {
      access: {
        expiresIn: '5m',
      },
      refresh: {
        expiresIn: '60d',
      },
    },
    numberOfSessions: 5,
  },
  auth: {
    emailConfirmation: true,
  },
  clientUrl: 'http://localhost:3000',
};
