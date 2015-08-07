
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

var vulcanize = require('gulp-vulcanize'),
    htmlmin = require('gulp-html-minifier');


// Paths

var rootDirectory = path.resolve('./'),
    sourceDirectory = path.join(rootDirectory, './src');

var buildDirectory = './build',
    distDirectory = './dist';


gulp.task('watch', function () {
    runSequence('process-all', function() {
        gulp.watch([
            sourceDirectory + '/**/*.js',
            sourceDirectory + '/**/*.html',
            sourceDirectory + '/**/*.less'
        ], ['process-all']);
    });
});


gulp.task('copy', function () {
    return gulp.src(sourceDirectory + '/**/*', { base: sourceDirectory })
        .pipe(gulp.dest(buildDirectory));
});


gulp.task('clean', function (done) {
    del([buildDirectory, distDirectory], done);
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


gulp.task('vulcanize', function () {
    return gulp.src(buildDirectory + '/lime.html')
        .pipe(vulcanize({
            excludes: [],
            stripExcludes: false,
            inlineCss: true,
            inlineScripts: true
        }))
        .pipe(gulp.dest(distDirectory));
});


gulp.task('minify', function() {
    return gulp.src(distDirectory + '/lime.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            minifyJS: true,
            minifyCSS: true
        }))
        .pipe(rename('lime.min.html'))
        .pipe(gulp.dest(distDirectory));
});


gulp.task('serve', function (done) {
    var port = 9000;
    console.log('Listening to localhost on port ' + port);
    console.log('Access the Limerence docs on', 'http://localhost:'+port+'/docs'.yellow);
    connect().use(serveStatic('./')).listen(port);
});


gulp.task('build', function (done) {
    runSequence('clean', 'copy', 'less', 'vulcanize', 'minify', done);
});


gulp.task('process-all', function (done) {
    runSequence('build', done);
});


gulp.task('default', function () {
    runSequence('process-all');
});
