'use strict';

const express = require('express');
const router  = express.Router();

// Handlers
const homepage    = require('../handlers/homepage');
const about       = require('../handlers/about');
const contactForm = require('../handlers/contactForm');
const services    = require('../handlers/services');

// Middleware
const getFooterBlogPosts = require('../middleware/getFooterBlogPosts');

// Gets a list of blog posts for each GET request on this router
// The posts are displayed in the site footer
router.all('/', getFooterBlogPosts);

/* GET home page. */
router.get('/', homepage);

// GET about page
router.get('/about', about);

// GET services page.
router.get('/services', services);

// POST contact form
router.post('/contact', contactForm);

module.exports = router;
