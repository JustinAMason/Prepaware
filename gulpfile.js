const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('sass', function () {
    return gulp.src('./src/public/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/public/css'));
});

gulp.task("default", ["sass"]);