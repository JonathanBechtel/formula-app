const path = require('path');

module.exports = {
  entry: './node_modules/typed.js/src/typed.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public')
  }
};
