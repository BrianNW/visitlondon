var gulp = require('gulp');
//requires gulp from package.json
var sass = require('gulp-sass');
//requires gulp from package.json



//tasks method used for gulp
gulp.task('sass', function(){
  return gulp.src('src/scss/app.scss')
    //The gulp task sass will pupe the src/scss/app.scss file
    //changes into the app/css/app.css file
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest('app/css'));

});

gulp.task('default', ['sass']);
//['*task', 'task2', ...] tasks will run with defult gulp command
