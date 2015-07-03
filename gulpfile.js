
// Requirements

var gulp = require('gulp'),
    karma = require('karma').server,
    concat = require('gulp-concat'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sourcemaps = require("gulp-sourcemaps"),
    source = require('vinyl-source-stream');

var path = require('path'),
    plumber = require('gulp-plumber'),
    runSequence = require('run-sequence');

var babel = require("gulp-babel"),
    babelify = require('babelify'),
    browserify = require('browserify'),
    jshint = require('gulp-jshint');

var less = require('gulp-less'),
    cssmin = require('gulp-cssmin'),
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
        //.pipe(sourcemaps.init())
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


/////////////////


/**
 * Validate source JavaScript
 */
gulp.task('jshint', function () {
    return gulp.src(lintFiles)
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

/**
 * Babel ES6 to ES5
 */
gulp.task('modules', function() {
    return browserify({
            debug: true,
            entries: sourceDirectory + '/naranja/naranja.module.js'
        })
        .transform(babelify.configure({
            sourceMapRelative: './src/'
        }))
        .bundle()
        .on('error', function (err) {
            console.log('Error : ' + err.message);
            this.emit('end');
        })
        .pipe(source('naranja.js'))
        .pipe(gulp.dest(buildDirectory));
});

gulp.task('uglify', function() {
    return gulp.src(buildDirectory + '/naranja.js')
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest(buildDirectory));
});

gulp.task('cssmin', function () {
    return gulp.src(buildDirectory + '/naranja.css')
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(buildDirectory));
});

/**
 * Run test once and exit
 */
gulp.task('test-dist', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});

/**
 * Run test once and exit
 */
gulp.task('test-dist-minified', function (done) {
    karma.start({
        configFile: __dirname + '/karma-min.conf.js',
        singleRun: true
    }, done);
});

/**
 * Run simple server to test Naranja UIKit
 */
gulp.task('serve', function (done) {
    var port = 9000;
    console.log('Listening to localhost on port ' + port);
    console.log('Access the Limerence docs on', 'http://localhost:'+port+'/docs'.yellow);
    connect().use(serveStatic('./')).listen(port);
});

/**
 * Default
 */
gulp.task('default', function () {
    runSequence('process-all', 'watch');
});
