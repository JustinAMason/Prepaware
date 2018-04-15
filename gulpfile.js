const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('sass', function () {
    return gulp.src('./src/public/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./src/public/css'));
});

gulp.task("watch", function() {
    gulp.watch('./src/public/sass/*.scss', ['sass']);
});

gulp.task("default", ["watch"]);