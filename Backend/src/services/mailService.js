const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const compileTemplate = (templateName, data) => {
  const templatePath = path.join(__dirname, '../templates', templateName);
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  const template = handlebars.compile(templateSource);
  return template(data);
};

exports.sendActivationEmail = async (email, adminId) => {
  const link = `${process.env.APP_URL}/activate/${adminId}`;
  const html = compileTemplate('activationEmail.hbs', { email, link });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Activate Your Account',
    html,
  });
};

exports.onbordedEmail = async (email, learnerId, name, surname) => {
  const html = compileTemplate('learnerOnboardedEmail.hbs', { email, learnerId, name, surname });
  console.log('learnerId', learnerId);
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Onboarded To Attendance Register',
    html,
  });
};