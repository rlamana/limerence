
// Requirements

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sourcemaps = require("gulp-sourcemaps"),
    source = require('vinyl-source-stream');

var path = require('path'),
    plumber = require('gulp-plumber'),
    runSequence = require('run-sequence');

var less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer');

var connect = require('connect'),
    serveStatic = require('serve-static'),
    colors = require('colors');


// Paths

var rootDirectory = path.resolve('./'),
    sourceDirectory = path.join(rootDirectory, './src');

var buildDirectory = './dist';

gulp.task('process-all', function (done) {
    runSequence('build', done);
});


gulp.task('watch', function () {
    // Watch JavaScript files
    gulp.watch([
        sourceDirectory + '/**/*.js',
        sourceDirectory + '/**/*.html',
        sourceDirectory + '/**/*.less'
    ], ['process-all']);
});


gulp.task('copy', function () {
    return gulp.src(sourceDirectory + '/**/*', { base: sourceDirectory })
        .pipe(gulp.dest(buildDirectory));
});


gulp.task('clean', function (done) {
    del([buildDirectory], done);
});


gulp.task('less', function() {
    return gulp.src(buildDirectory + '/**/*.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false,
            options: {
                map: true
            }
        }))
        .pipe(gulp.dest(buildDirectory));
});


gulp.task('build', function (done) {
    runSequence('clean', 'copy', 'less', done);
});


gulp.task('serve', function (done) {
    var port = 9000;
    console.log('Listening to localhost on port ' + port);
    console.log('Access the Limerence docs on', 'http://localhost:'+port+'/docs'.yellow);
    connect().use(serveStatic('./')).listen(port);
});


gulp.task('default', function () {
    runSequence('process-all', 'watch');
});
