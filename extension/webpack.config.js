const path = require('path');

module.exports = {
  entry: {
    background: './src/background/background.js',
    content: './src/content/content.js',
    // Add other scripts as needed
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js', // Outputs background.bundle.js and content.bundle.js
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
