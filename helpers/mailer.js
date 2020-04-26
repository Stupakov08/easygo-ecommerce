const nodemailer = require('nodemailer');
require('dotenv').config();
var fs = require('fs');

require.extensions['.html'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendMail = ({ email, subject, html }) => {
  const mailOptions = {
    from: 'noreplay@gmail.com',
    to: email,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendMail,
};
