const returnError = res => err => {
  const { status, message, stack } = err;
  return res
    .status(status || 500)
    .json({ message, ...(process.env.NODE_MODE && { stack }) });
};

const returnAuthTokens = res => ({ accessToken, refreshToken }) => {
  res.cookie('refreshToken', refreshToken, {
    maxAge: Number(Date.now()) + 60 * 60 * 24 * 60,
    path: '/api/auth', //Send cookie only on this endpoint
    domain: 'localhost',
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
