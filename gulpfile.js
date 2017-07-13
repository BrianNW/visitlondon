var gulp = require('gulp');
//requires gulp from package.json
var sass = require('gulp-sass');
//requires gulp from package.json
var browserSync = require('browser-sync');
var reload = browserSync.reload; //sub-method from browserSync

var SOURCEPATHS = {

  sassSource : 'src/scss/*.scss'  //will check for any file that has .scss extension
}
var APPPATH = {
  root : 'app/',
  css : 'app/css',
  js : 'app/js'
}

//tasks method used for gulp
gulp.task('sass', function(){
  return gulp.src(SOURCEPATHS.sassSource)
    //The gulp task sass will pupe the src/scss/app.scss file
    //changes into the app/css/app.css file
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest(APPPATH.css));

});

gulp.task('serve', ['sass'], function() {
  browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
    server : {
      baseDir : APPPATH.root
    }
  })
  //initializes browserSync
});

gulp.task('watch', ['serve', 'sass'], function () {
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);

})

gulp.task('default',['watch'] );
//['*task', 'task2', ...] tasks will run with defult gulp command
