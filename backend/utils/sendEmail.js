const nodemailer = require('nodemailer');

const sendEmail = async (subject, message, send_to, send_from, reply_to) => {
  //Create Email transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      PASS: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // option for sendin email
  const options = {
    from: send_from,
    to: send_to,
    replyTo: reply_to,
    subject: subject,
    html: message,
  };
  //send email
  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

module.exports = sendEmail;
