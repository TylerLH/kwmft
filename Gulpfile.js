require('dotenv').load();
const gulp        = require('gulp');
const babel       = require('gulp-babel');
const sass        = require('gulp-sass');
const nodemon     = require('gulp-nodemon');
const livereload  = require('gulp-livereload');
const notify      = require('gulp-notify');
const gutil       = require('gulp-util');
const source      = require('vinyl-source-stream');
const buffer      = require('vinyl-buffer');
const sourcemaps  = require('gulp-sourcemaps');
const exec        = require('child_process').exec;
const fs          = require('fs');
const _           = require('lodash');
const gulpif      = require('gulp-if');
const uglify      = require('gulp-uglify');
const cssmin      = require('gulp-cssmin');
const rename      = require('gulp-rename');
const filter      = require('gulp-filter');
const awspublish  = require('gulp-awspublish');
const RevAll      = require('gulp-rev-all');
const cloudfront  = require('gulp-cloudfront');
const del         = require('del');
const git         = require('gulp-git');

const LR_PORT = 35729;
const PATHS = {
  JS_SRC        : './assets/javascripts/**/*.js',
  JS_PUBLIC     : './public/javascripts',
  JS_BUILD      : './build/assets/javascripts',
  STYLES_SRC    : './assets/stylesheets/**/*.scss',
  STYLES_PUBLIC : './public/stylesheets',
  STYLES_BUILD  : './build/assets/stylesheets'
}

const aws = {
    "key": process.env.AWS_ID,
    "secret": process.env.AWS_KEY,
    "params": {
      "Bucket": "kwmft"
    },
    "region": "us-east-1",
    "distributionId": process.env.CLOUDFRONT_ID
};

const isProd = process.env.NODE_ENV === 'production';

// Javascript processing
gulp.task('js', () => {

  const babelConfig = { presets: ['es2015'] }
  const destPath = isProd ? PATHS.JS_BUILD : PATHS.JS_PUBLIC;

  gulp
    .src(PATHS.JS_SRC)
    .pipe(babel(babelConfig))
    .pipe(gulpif(isProd, uglify()))
    .pipe(gulp.dest(destPath))
    .pipe(gulpif(!isProd, livereload()))
});

// Stylesheets Processing
gulp.task('sass', () => {

  const sassConfig = { includePaths: ['node_modules'] }
  const destPath = isProd ? PATHS.STYLES_BUILD : PATHS.STYLES_PUBLIC;

  gulp
    .src(PATHS.STYLES_SRC)
    .pipe(sass(sassConfig).on('error', sass.logError))
    .pipe(gulpif(isProd, cssmin()))
    .pipe(gulp.dest(destPath))
    .pipe(gulpif(!isProd, livereload()))
});

// Runs a dev server
gulp.task('dev-server', () => {
  nodemon({
    env: { 'NODE_ENV': 'development', 'DEBUG': 'kwmft' },
    script: './bin/www.js',
    ignore: ['node_modules', 'assets', 'public'],
    ext: 'js jade',
    execMap: {
      'js': 'node --debug'
    }
  });
});

gulp.task('livereload', () => {
  server.listen(LR_PORT, (err) => {
    if (err) return gutil.log(err);
  });
});

// Watch assets & rebuild as needed
gulp.task('watch', () => {
  livereload.listen();
  gulp.watch('./assets/javascripts/**/*.js', ['js']);
  gulp.watch('./assets/stylesheets/**/*.scss', ['sass']);
});

// Create nginx config based off template
gulp.task('nginx:config', (done) => {
  const configTemplate = _.template(fs.readFileSync('./config/nginx.template.conf', {encoding: 'utf8'}));
  const __DEV__   = process.env.NODE_ENV !== 'production';
  const __PROD__  = process.env.NODE_ENV === 'production';
  const crtFile   = __DEV__ ? process.cwd() + '/config/server.crt' : '/tls/server.crt';
  const keyFile   = __DEV__ ? process.cwd() + '/config/server.key' : '/tls/server.key';
  const config = configTemplate({crtFile, keyFile});
  fs.writeFileSync('./config/nginx.conf', config, 'utf8', done)
});

gulp.task('nginx', (done) => {
  exec('nginx -c ./config/nginx.conf -p $(pwd)', (err, stdout, stderr) => {
    gutil.log(stdout);
    gutil.log(stderr);
    done(err);
  });
});

function prepublishAssets() {
  const revAll = new RevAll({ dontRenameFile: [/^\/favicon.ico$/g, '.html', /vendor\//g] });

  return gulp
    .src('./public/**/*')
    .pipe(revAll.revision())
    .pipe(gulp.dest('./cdn'))
    .pipe(revAll.manifestFile())
    .pipe(gulp.dest('./cdn'))
}

function publishAssets() {
  const publisher = awspublish.create(aws);
  const headers = {'Cache-Control': 'max-age=315360000, no-transform, public'};
  return gulp
    .src('./cdn/**/*')
    .pipe(awspublish.gzip())
    .pipe(publisher.publish(headers))
    .pipe(publisher.cache())
    .pipe(awspublish.reporter())
    .pipe(cloudfront(aws))
}

function cleanAssets() {
  return del(['./cdn/**/*']);
}

gulp.task('assets', ['js', 'sass']);
gulp.task('assets:prepublish', prepublishAssets);
gulp.task('assets:publish', publishAssets);
gulp.task('assets:clean', cleanAssets);
gulp.task('assets:deploy', ['assets:clean', 'assets', 'assets:prepublish', 'assets:publish']);
gulp.task('default', ['dev-server', 'js', 'sass', 'watch']);
