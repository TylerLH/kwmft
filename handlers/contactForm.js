'use strict';

const escape = require('lodash/escape');
const mailer = require('../lib/mailer');
const request = require('superagent');

function renderMessageHTML(data) {
  return `
    <html>
      <head>
        <title>New Contact Inquiry</title>
        <style type="text/css">
          a { color: #336699; }
        </style>
      </head>
      <body>
        <p>${data.message}</p>
        <p>${data.name} / ${data.email}</p>
        <p><strong>Respond to this email to send a reply.</strong></p>
        <p><small>Sent via kwmft.com contact form.</small></p>
      </body>
    <html>
  `
}

function renderMessageText(data) {
  return `
    New Message Received from ${data.name} (${data.email})

    ### Message is below. ###

    ${data.message}

    -----------------------------------------------
    Reply to this email to respond to the sender.
  `
}

function validateMessage(req, done) {
  const captchaResponse = req.body.captcha;
  const captchaSecret = process.env.RECAPTCHA_SECRET;

  if (!captchaResponse) {
    return done(new Error('No valid captcha response submitted.'));
  } else {
    request
      .post('https://www.google.com/recaptcha/api/siteverify')
      .send(`secret=${captchaSecret}`)
      .send(`response=${captchaResponse}`)
      .end( (err, response) => {
        if (err) return done(err);
        if (!response.body.success) {
          return done(new Error('Invalid captcha response.'));
        }
        return done(null)
      })
  }
}

function sendMessage(req, done) {
  const data = {
    name: escape(req.body.name),
    email: escape(req.body.email),
    message: escape(req.body.message)
  }

  const html = renderMessageHTML(data);
  const text = renderMessageText(data);

  mailer.sendMail({
    to: 'info@kwmft.com',
    from: 'info@kwmft.com',
    replyTo: `"${data.name}" <${data.email}>`,
    subject: 'New Contact Form Inquiry',
    html: html,
    text: text
  }, function(err, info) {
    if (err) return done(err);
    return done(null);
  })
}

module.exports = {
  get: (req, res, next) => {
    res.render('contact', {
      meta: {
        title: 'Contact Information | Katherine Warner, MA, MFT',
        description: 'Find out where Katherine provides therapy services and send a message.'
      }
    })
  },
  post: function(req, res, next) {
    // validateMessage(req, (err) => {
    //   if (err) return next(err);
    //
    // })
    sendMessage(req, (err) => {
      if (err) return next(err);
      return res.sendStatus(201);
    })
  }
}
