'use strict';

// Required Modules
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const del = require('del');
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const reload = browserSync.reload;
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');

// Scripts Task
gulp.task('scripts', () =>
    gulp.src(['src/js/**/*.js', '!src/js/**/*.min.js'])
        .pipe(plumber())
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('src/js'))
        .pipe(reload({ stream: true }))
);

// Sass Task
gulp.task('sass', () =>
    gulp.src('src/sass/**/*.scss')
        .pipe(sass({ outputStyle: 'compressed' })
            .on('error', sass.logError))
        .pipe(autoprefixer('last 4 versions'))
        .pipe(gulp.dest('src/css'))
        .pipe(reload({ stream: true }))
);

// HTML Task
gulp.task('html', () =>
    gulp.src('src/**/*.html')
        .pipe(reload({ stream: true }))
);

// Browser-Sync Task
gulp.task('browser-sync', () =>
    browserSync({
        server: {
            baseDir: './src/'
        }
    })
);

// Watch Tasks
gulp.task('watch', () => {
    gulp.watch('src/js/**/*.js', ['scripts']);
    gulp.watch('src/sass/**/*.scss', ['sass']);
    gulp.watch('src/**/*.html', ['html']);
});

// Build Task
gulp.task('build', () =>
    // delete old build folder if present
    del(['dist']).then(() =>
        // create new build directory for all files
        gulp.src('src/**/*/')
            .pipe(gulp.dest('dist/'))
            .on('end', () =>
                // remove unwanted build files   
                del([
                    'dist/sass',
                    'dist/js/!(*.min.js)'
                ])
            )
    )
);

// Default Task
gulp.task('default', ['scripts', 'sass', 'html', 'browser-sync', 'watch']);