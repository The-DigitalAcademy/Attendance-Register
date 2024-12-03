const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const { env } = require('dotenv');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
console.log("sss", this.auth);
// console.log(env('EMAIL_USER'))
const compileTemplate = (templateName, data) => {
  const templatePath = path.join(__dirname, '../templates', templateName);
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  const template = handlebars.compile(templateSource);
  return template(data);
};

exports.sendActivationEmail = async (email, adminId) => {
  const link = `${process.env.APP_URL}/activate/${adminId}`;
  const html = compileTemplate('activationEmail.hbs', { link });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Activate Your Account',
    html,
  });
};


