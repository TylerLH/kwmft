module.exports = function(req, res) {
  const model = {
    meta: {
      title: 'About Katherine'
    }
  }
  res.render('about', model);
}
