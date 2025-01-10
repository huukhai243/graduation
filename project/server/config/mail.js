const nodeMailer = require("nodemailer");

const { MAIL_USER, MAIL_PASS } = {
  MAIL_USER: "huukhai244@gmail.com",
  MAIL_PASS: "oejfbkfrbpmrykyr",
};

const transporter = nodeMailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

const MailConfig = {
  sendMail({ mailTo, subject, html, from = "Quan ly ktx", ...more }) {
    transporter.sendMail({
      from: from,
      to: mailTo,
      subject: subject,
      html: html,
      ...more,
    });
  },
};

module.exports = MailConfig;
