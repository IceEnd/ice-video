import path from 'path';
import webpack from 'webpack';

export default {
  entry: [
    'react-hot-loader/patch',
    path.join(__dirname, './test/index.js'),
  ],
  output: {
    path: path.join(__dirname, 'dist/static/'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  context: path.resolve(__dirname, './test'),
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, 'test'),
    publicPath: '/static/',
    port: 3000,
    stats: {
      colors: true, // Nice colored output
      progress: true,
      inline: true,
      noInfo: true,
    },
  },
  module: {
    rules: [
      {
        test: /.jsx$/,
        use: ['react-hot-loader/webpack', 'babel-loader'],
        exclude: /node_modules/,
        include: __dirname,
      },
      {
        test: /.js$/,
        loaders: ['react-hot-loader/webpack', 'babel-loader'],
        exclude: /node_modules/,
        include: __dirname,
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: 'file-loader?name=fonts/[name].[ext]',
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'url-loader?limit=10000&name=images/[name].[ext]',
      },
    ],
  },
  devtool: 'eval-source-map',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
