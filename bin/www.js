var debug = require('debug')('kwmft');
var app = require('../app');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  debug('HTTP server listening on port ' + server.address().port);
});
