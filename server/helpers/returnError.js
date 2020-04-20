const returnError = (err, res) => {
  const { status, ...rest } = err;
  return res.status(status || 500).json(rest);
};

module.exports = returnError;
