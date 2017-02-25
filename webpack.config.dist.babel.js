import path from 'path';
import webpack from 'webpack';

export default {
  entry: [
    path.join(__dirname, './src/index.js'),
  ],

  output: {
    filename: 'ice-video.js',
    path: path.join(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /.js$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/,
        include: __dirname,
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
