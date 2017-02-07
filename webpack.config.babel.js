import path from 'path';
import webpack from 'webpack';

export default {
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    path.join(__dirname, './src/index.js'),
  ],
  output: {
    path: path.join(__dirname, 'dist/static/'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  context: path.resolve(__dirname, './src'),
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, 'src'),
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
        use: ['babel-loader'],
        exclude: /node_modules/,
        include: __dirname,
      },
      {
        test: /.js$/,
        loaders: ['babel-loader'],
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
        test: /\.(woff|woff2|svg|eot|ttf)$/,
        loader: 'file-loader?name=fonts/[name].[ext]',
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'url-loader?limit=10000&name=images/[name].[ext]',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
