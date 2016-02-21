var nodemailer = require('nodemailer');
var ses = require('nodemailer-ses-transport');
var transporter = nodemailer.createTransport(ses({
    accessKeyId: process.env.SMTP_USERNAME,
    secretAccessKey: process.env.SMTP_PASSWORD,
    region: 'us-west-2'
}));

module.exports = transporter;
