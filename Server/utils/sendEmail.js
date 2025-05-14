// utils/sendEmail.js
const nodemailer = require("nodemailer");
const config = require("../config/config");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });

  const message = {
    from: `${config.appName} <${config.emailFrom}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(message);
};

module.exports = sendEmail;
