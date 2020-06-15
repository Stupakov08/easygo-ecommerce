require('dotenv').config();
const chartServices = require('../services/chart');
const { returnError, returnBody, returnData } = require('../helpers/helpers');

const get = async (req, res) => {
  chartServices.get().then(returnBody(res, req)).catch(returnError(res));
};

module.exports = {
  get,
};
