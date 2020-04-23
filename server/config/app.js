module.exports = {
  jwt: {
    tokens: {
      access: {
        expiresIn: '2m',
      },
      refresh: {
        expiresIn: '7d',
      },
    },
    numberOfSessions: 5,
  },
};
