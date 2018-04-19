const gulp = require('gulp');
const sass = require('gulp-sass');
const eslint = require("gulp-eslint");

gulp.task('sass', function () {
    return gulp.src('./src/public/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./src/public/css'));
});

gulp.task('lint', () => {
    return gulp.src(['**/*.js','!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task("watch", function() {
    gulp.watch('./src/public/sass/*.scss', ['sass']);
});

gulp.task("default", ["watch"]);