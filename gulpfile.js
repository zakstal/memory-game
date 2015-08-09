var gulp = require('gulp');
var jade = require('gulp-jade');
var uglify = require('gulp-uglify');
var util = require('gulp-util');
var $ = require('gulp-load-plugins')();

console.log('here');
 
gulp.task('templates', function() {
  gulp.src('./src/**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('./dist/'))
});
 
gulp.task('compress', function() {
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

gulp.task('watch', function () {
    util.log(util.colors.bgGreen.bold('Gulp is now watching for changes!'));

    // gulp.watch('./src/**/*.jade', ['html']);
    // gulp.watch('./src/**/*.less', ['styles']);
    // gulp.watch('./src/**/*.js', ['scripts']);

    gulp.watch(['dist/pages/index.jade', 'dist/js/*.js', 'dist/css/*.css']);
});

gulp.task('default', ['templates', 'vendor-scripts', 'compress', 'watch']);


