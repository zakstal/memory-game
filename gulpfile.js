var gulp = require('gulp');
var pkg = require('./package.json');
var jade = require('gulp-jade');
var uglify = require('gulp-uglify');
var util = require('gulp-util');
var $ = require('gulp-load-plugins')();

var AUTOPREFIXER_BROWSERS = [
    'ie >= 9',
    'ie_mob >= 9',
    'chrome >= 39',
    'and_chr >= 39',
    'safari >= 6.1',
    'ff >= 34',
    'ios >= 6.1',
    'android >= 4'
];

var currentDate = new Date();

var year = currentDate.getFullYear();

var formattedTime = currentDate.toLocaleTimeString(currentDate);

var datetime = currentDate.getMonth() + 1 + '/'
    + currentDate.getDate() + '/'
    + currentDate.getFullYear() + ' @ '
    + formattedTime;

var copyright = '* Copyright (c) ' + year + ' MemoryGame';
var version = '* @version v' + pkg.version;
var buildDate = '* File built on: ' + datetime;

var cvb = [
		' ' + copyright,
    ' ' + version,
    ' ' + buildDate].join('\n');

var htmlBanner = ['<!--',
    cvb,
    ' -->',
    ''].join('\n');

var jsBanner = ['\n', '/*!',
    cvb,
    ' */',
    ''].join('\n');

var cssBanner = ['/*!***********************************',
    cvb,
    ' *************************************/',
    ''].join('\n');

function onError (err) {
    util.log(util.colors.red(err.message));

    $.notify.onError({
        title: 'Compilation Failure!',
        message: 'Check your terminal console',
        sound: 'Basso'
    })(err);

    this.emit('end');
}
 
gulp.task('templates', function() {
	util.log(util.colors.bgGreen.bold('Compiling jade tempates'));
  gulp.src('./src/**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('./dist/'))
});
 
gulp.task('compress', function() {
  util.log(util.colors.bgGreen.bold('Concatenate & minify your JS'));
  return gulp.src('src/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('vendor-scripts', function () {
    util.log(util.colors.bgGreen.bold('Concatenate & minify vendor JS'));

    return gulp.src([
        './node_modules/underscore/underscore.js',
        './node_modules/jquery/dist/jquery.js',
        './node_modules/backbone/backbone.js',
        './src/common/vendor/**/*.js'
    ])
        .pipe($.sourcemaps.init())
        .pipe($.concat('vendor.js'))
        .pipe(uglify({
            mangle: true,
            compress: {
                sequences: true,
                dead_code: true,
                conditionals: true,
                booleans: true,
                unused: true,
                if_return: true,
                join_vars: true
            }
        }).on('error', util.log))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('dist/js'))
        .pipe($.size({title: 'vendor scripts'}));
});

// Compile, auto-prefix, concatenate & minify stylesheets
gulp.task('styles', function () {
    util.log(util.colors.bgGreen.bold('Compiling LESS --> CSS'));

    return gulp.src([
        './src/less/global-imports.less',
        './src/components/**/*.less'
    ]).pipe($.plumber({
        errorHandler: onError
    }))
        .pipe($.sourcemaps.init())
        .pipe(gulp.dest('src/less'))
        .pipe($.less())
        .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
        .pipe($.minifyCss())
        .pipe($.wrapper({
            footer: cssBanner
        }))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('dest/css'))
        .pipe($.size({title: 'styles'}));
});

gulp.task('watch', function () {
    util.log(util.colors.bgGreen.bold('Gulp is now watching for changes!'));

    // gulp.watch('./src/**/*.jade', ['html']);
    // gulp.watch('./src/**/*.less', ['styles']);
    // gulp.watch('./src/**/*.js', ['scripts']);

    gulp.watch(['dist/pages/index.jade', 'dist/js/*.js', 'dist/css/*.css']);
});

gulp.task('default', ['templates', 'styles', 'vendor-scripts', 'compress', 'watch']);


