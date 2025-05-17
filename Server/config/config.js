// config/config.js
module.exports = {
  appName: "SkillBridge",
  emailFrom: process.env.FROM_EMAIL || "no-reply@skillbridge.com",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  smtp: {
    host: process.env.SMTP_HOST || "smtp.mailtrap.io",
    port: process.env.SMTP_PORT || 2525,
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
};
