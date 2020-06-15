require('dotenv').config();
const fs = require('fs');
const path = require('path');
const uid = require('uid');
const {
  decodeBase64Image,
  addIdField,
  productIdtoLine,
  makeImageUrls,
} = require('../helpers/helpers');

const Order = require('../models/order');

const getChart = async () => {
  let orders;
  try {
    var from = new Date();
    from.setMonth(from.getMonth() - 1);

    orders = await Order.aggregate([
      { $match: { createdAt: { $gte: from } } },
      {
        $group: {
          _id: {
            date: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' },
            },
          },

          count: {
            $sum: 1,
          },
          amount: {
            $sum: '$payment.amount',
          },
        },
      },
    ]);
  } catch (e) {
    orders = [];
  }
  return orders;
};

const getSummaries = async () => {
  let orders;

  try {
    var from = new Date();
    from.setMonth(from.getMonth() - 1);

    orders = await Order.aggregate([
      { $match: { createdAt: { $gte: from } } },
      {
        $group: {
          _id: null,
          month_summ: {
            $sum: '$payment.amount',
          },
          avg_summ: {
            $avg: '$payment.amount',
          },
        },
      },
    ]);
  } catch (e) {
    orders = [];
  }
  return orders[0];
};

const get = async () => {
  const chart = await getChart();
  const summaries = await getSummaries();

  return { chart, summaries };
};

module.exports = {
  get,
};
