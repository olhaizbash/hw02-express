const nodemailer = require("nodemailer");

require("dotenv").config();

const config = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "olhaizbash@meta.ua",
    pass: process.env.EMAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);
const sendEmail = async (data) => {
  const email = { ...data, from: "olhaizbash@meta.ua" };
  await transporter.sendMail(email);
  return true;
};

module.exports = sendEmail;
