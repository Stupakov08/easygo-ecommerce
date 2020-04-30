const returnError = res => err => {
  const { status, message, stack } = err;
  return res
    .status(status || 500)
    .json({ message, ...(process.env.NODE_MODE && { stack }) });
};

const returnAuthTokens = (res, req) => ({ accessToken, refreshToken }) => {
  return res.status(200).json({ accessToken, refreshToken });
};

const isDevelopmentMode = () => {
  return process.env.NODE_MODE === 'development' ? true : false;
};

module.exports = {
  returnError,
  returnAuthTokens,
  isDevelopmentMode,
};
