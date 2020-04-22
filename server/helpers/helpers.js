const returnError = (err, res) => {
  const { status, message } = err;
  return res.status(status || 500).json({ message });
};

const returnAuthTokens = ({ accessToken, refreshToken }, res) => {
  res.cookie('refreshToken', refreshToken, {
    maxAge: Number(Date.now()) + 60 * 60 * 24 * 60,
    httpOnly: true, //Deny access to cookie via JS
    secure: isDevelopmentMode() ? false : true, //Allow req only with ssl
  });
  return res.json({ accessToken });
};

const isDevelopmentMode = () => {
  return process.env.NODE_MODE === 'development' ? true : false;
};

module.exports = {
  returnError,
  returnAuthTokens,
  isDevelopmentMode,
};
