'use strict';

module.exports = function(req, res) {
  const model = {
    meta: {
      title: 'Services'
    }
  }
  res.render('services', model);
}
