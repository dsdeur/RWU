// Includes
var gulp = require('gulp');
var compass = require('gulp-compass');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var reactify = require('reactify');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var gzip = require('gulp-gzip');
var concat = require('gulp-concat');
var gulpShell = require('gulp-shell');


var buildBasePath = './public';

// Set the paths
var paths = {
    styles: {
        src: './src/scss/*.scss',
        watch: './src/scss/**/*.scss',
        dest: buildBasePath + '/css'
    },
    scripts: {
        src: './src/js/**/*.{js,jsx}',
        dest: buildBasePath + '/js'
    },
    images: {
        src: './src/img/*',
        dest: buildBasePath + '/img'
    },
    fonts: {
        src: './src/fonts/*',
        dest: buildBasePath + '/fonts'
    },
    html: {
        src: './src/*.*',
        dest: buildBasePath + '/'
    }    
};

// Gulp plumber error handler
var onError = function(err) {
    console.log(err);
};

// Convert sassy files in css
gulp.task('compass', function() {
    return gulp.src(paths.styles.src)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(compass({
            config_file: './config.rb',
            css: paths.styles.dest,
            sass: 'src/scss'
        }))
        .pipe(gulp.dest(paths.styles.dest));
});

// Process images
gulp.task('images', function() {
    return gulp.src(paths.images.src)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}]
        }))
        .pipe(gulp.dest(paths.images.dest));
});

// Process fonts
gulp.task('fonts', function() {
    return gulp.src(paths.fonts.src)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(gulp.dest(paths.fonts.dest));
});

// Process html files
gulp.task('html', function() {
    return gulp.src(paths.html.src)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(gulp.dest(paths.html.dest));
});


// Build the javascript
// Convert JSX
// Browserify
gulp.task('build-js', function() {
    var stream = browserify({
        entries: ['./src/js/app.js'],
        extensions: ['.js', '.jsx'],
        paths: ['./src/js/components', './src/js/lib', './src/js']
    }) // browserify
        .transform(reactify)
        .bundle({debug: !gutil.env.production})
        .on('error', function(err) {
            gutil.log(err);
            stream.end();
        });

    return stream
        .pipe(source('app.js'))
        .pipe(plumber({
            errorHandler: onError
        }))
        //.pipe(streamify(uglify()))
        //.pipe(streamify(gzip()))
        .pipe(gulp.dest(paths.scripts.dest));
});


// gulp.task('bundlejs', function() {
//     return gulp.src(['src/js/lib/*.js', 'build/js/lib.js'])
//         .pipe(plumber({
//             errorHandler: onError
//         }))
//         .pipe(concat('lib.js'))
//         .pipe(streamify(uglify()))
//         .pipe(gulp.dest(paths.scripts.dest));
// });

// Starts development local server and watches changes
gulp.task('serve', function() {
    var cleanBuildPath = buildBasePath.substring(2);
    // Start server
    browserSync.init(
        // Reload on build change
        [cleanBuildPath + '/css/**/*.css', cleanBuildPath + '/js/**/*.js', cleanBuildPath + '/*.html'], {
        server: {
            baseDir: buildBasePath
        },
        notify: false
    });
});

gulp.task('watch', function() {
    // Watch files
    gulp.watch(paths.styles.watch, ['compass']);
    gulp.watch(paths.scripts.src, ['build-js']);
    gulp.watch(paths.images.src, ['images']);
    gulp.watch(paths.fonts.src, ['fonts']);
    gulp.watch(paths.html.src, ['html']);
});

// Create tasks
gulp.task('build', ['compass', 'build-js', 'images', 'fonts', 'html']);
gulp.task('s', ['build', 'serve', 'watch']);
gulp.task('w', ['build', 'watch']);
gulp.task('default', ['s']);
