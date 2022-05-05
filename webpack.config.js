const path = require('path');

module.exports = {
  entry: './src/editorjs-paragraph-linebreakable.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'editorjs-paragraph-linebreakable.bundle.js',
    library: 'editorjsParagraphLinebreakable',
    libraryExport: 'default',
    libraryTarget: 'umd',
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.svg$/,
        use : [{
            loader  : 'svg-inline-loader',
            options : {
                removeSVGTagAttrs : false
            }
        }]
      }
    ],
  },
  // node: { global: true, fs: 'empty' },
  // optimization: {
  //   minimize: false
  // },
};
