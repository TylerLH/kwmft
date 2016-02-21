const escape = require('lodash/escape');
const mailer = require('../lib/mailer');

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

module.exports = function(req, res, next) {
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
    if (err) return next(err);
    res.sendStatus(201);
  })
}
