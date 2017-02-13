import gulp from 'gulp';
import webpack from 'webpack';
import gutil from 'gulp-util';
import clean from 'gulp-clean';
import gulpRev from 'gulp-rev';
import gulpRevCollector from 'gulp-rev-collector';
import webpackConfig from './webpack.config.babel';

gulp.task('clean', () =>
  gulp.src('dist/*', { read: false })
    .pipe(clean()),
);

gulp.task('js', () =>
  gulp.src('src/index.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulpRev())
    .pipe(gulp.dest('lib/static/'))
    .pipe(gulpRev.manifest())
    .pipe(gulp.dest('lib/')),
);

gulp.task('build', ['clean', 'webpack:build']);

gulp.task('webpack:build', (callback) => {
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      throw new gutil.PluginError('webpack:build', err);
    }

    gutil.log('[webpack:build]', stats.toString({
      colors: true,
    }));

    callback();
  });
});

gulp.task('html', ['build'], () =>
  gulp.src(['dist/*.json', 'src/index.html'])
    .pipe(gulpRevCollector({
      replaceReved: true,
      dirReplacements: {
        'static/': '',
      },
    }))
    .pipe(gulp.dest('lib/')),
);

gulp.task('default', ['build', 'html']);
