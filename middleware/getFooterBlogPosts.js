const request = require('superagent')
const _ = require('lodash')

const API_URL = 'http://blog.kwmft.com/wp-json/wp/v2/posts'
const MAX_POSTS = 5

module.exports = function (req, res, next) {
  if (req.method !== 'GET') return
  res.locals.footerBlogPosts = {
    error: null,
    data: []
  }
  request
    .get(API_URL)
    .end((err, data) => {
      if (err) {
        res.locals.footerBlogPosts.error = 'There was a problem getting the latest blog posts!'
        return next()
      }
      res.locals.footerBlogPosts.data = _.chain(data.body)
        .take(MAX_POSTS)
        .map(post => {
          post.excerpt.snippet = _.truncate(post.excerpt.rendered, { length: 120 })
          return post
        })
        .value()
      next()
    })
}
