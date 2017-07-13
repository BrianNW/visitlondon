var gulp = require('gulp');
//requires gulp from package.json
var sass = require('gulp-sass');
//requires gulp from package.json
var browserSync = require('browser-sync');
var reload = browserSync.reload; //sub-method from browserSync
var autoprefixer = require('gulp-autoprefixer');


var SOURCEPATHS = {  //src folder where changes are initially made

  sassSource : 'src/scss/*.scss',  //will check for any file that has .scss extension
  htmlSource: 'src/*.html'
}
var APPPATH = {  //app folder where final app is located
  root : 'app/',
  css : 'app/css',
  js : 'app/js'
}

//tasks method used for gulp
gulp.task('sass', function(){
  return gulp.src(SOURCEPATHS.sassSource)
    //autoprefixer
    .pipe(autoprefixer())
    //The gulp task sass will pupe the src/scss/app.scss file
    //changes into the app/css/app.css file
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    //output can be compressed or minified instead of expanded
    .pipe(gulp.dest(APPPATH.css));

});

gulp.task('copy', function() {
  gulp.src(SOURCEPATHS.htmlSource)
    .pipe(gulp.dest(APPPATH.root))
});

gulp.task('serve', ['sass'], function() {
  browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
    server : {
      baseDir : APPPATH.root
    }
  })
  //initializes browserSync
});

gulp.task('watch', ['serve', 'sass', 'copy'], function () {
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  gulp.watch([SOURCEPATHS.htmlSource], ['copy']);

});

gulp.task('default',['watch'] );
//['*task', 'task2', ...] tasks will run with defult gulp command
