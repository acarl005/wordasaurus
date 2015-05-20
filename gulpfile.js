var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('default', function() {
  return gulp.src(['js/external/*.js', 'js/*.js'])
             .pipe(concat('app.min.js'))
             .pipe(uglify())
             .pipe(gulp.dest('public/js'))
});
