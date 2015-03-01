var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var browserify = require('browserify');
var reactify = require('reactify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var externals = [
    'react/addons',
    'react-router',
    'reflux',
    'superagent',
];

var paths = {
    sass: ['./app/scss/*.scss', './app/scss/**/*.scss'],
    jsx: ['./app/jsx/*.jsx', './app/jsx/**/*.jsx'],
};

gulp.task('default', function() {
    gulp.start(
        'vendors',
        'jsx', 
        'sass',
        'watch'
    );
});

gulp.task('vendors', function() {
    var bundler = browserify({debug: true})
        .require(externals);

    return bundler.bundle()
        .pipe(source('vendors.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./www/js'));
});

gulp.task('jsx', function() {
    var bundler = browserify({ debug: true })
        .require(require.resolve('./app/jsx/App.jsx'), {entry: true})
        .transform(reactify)
        .external(externals);

    return bundler.bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        //.pipe(uglify())
        .pipe(gulp.dest('./www/js'));
});

gulp.task('sass', function(done) {
    gulp.src('./app/scss/app.scss')
        .pipe(sass())
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(gulp.dest('./www/css'))
        .on('end', done);
});

gulp.task('watch', function() {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.jsx, ['jsx'])
});
