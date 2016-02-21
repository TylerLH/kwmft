'use strict';

module.exports = function (filePath) {
  let baseUrl = '/';
  if (process.env.NODE_ENV === 'production') {
    baseUrl = 'https://dicp3uv9499so.cloudfront.net/';
    filePath = assetManifest[filePath];
  }
  return `${baseUrl}${filePath}`;
}
