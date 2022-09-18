'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

sass.compiler = require('node-sass');

gulp.task('sass', function () {
    return gulp.src('dashboard/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(function (f) {
            return f.base;
        }));
});

gulp.task('default', function () {
    gulp.watch('dashboard/**/*.scss', gulp.series('sass'));
});
