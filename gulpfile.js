var gulp = require('gulp');
//requires gulp from package.json
var sass = require('gulp-sass');
//requires gulp from package.json
var browserSync = require('browser-sync');
var reload = browserSync.reload; //sub-method from browserSync
var autoprefixer = require('gulp-autoprefixer');
var browserify = require('gulp-browserify');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var merge = require ('merge-stream');
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');
var injectPartials = require('gulp-inject-partials');
var minify = require('gulp-minify');
var rename = require('gulp-rename');
var cssmin = require('gulp-cssmin');
var htmlmin = require('gulp-htmlmin');


var SOURCEPATHS = {  //src folder where changes are initially made

  sassSource : 'src/scss/*.scss',  //will check for any file that has .scss extension
  sassApp : 'src/scss/app.scss',
  htmlSource: 'src/*.html',
  htmlPartialSource : 'src/partial/*.html',
  jsSource : 'src/js/**',
  imgSource : 'src/img/**'
}
var APPPATH = {  //app folder where final app is located
  root : 'app/',
  css : 'app/css',
  js : 'app/js',
  fonts : 'app/fonts',
  img: 'app/img'
}

//GULP TASK USED TO CLEAN UP UNUSED /APP INDEX FILES
gulp.task('clean-html', function() {
  return gulp.src(APPPATH.root + '/*.html', {read: false, force: true})
    .pipe(clean());

});
//GULP TASK USED TO CLEAN UP UNUSED /APP JS FILES
gulp.task('clean-scripts', function() {
  return gulp.src(APPPATH.js + '/*.js', {read: false, force: true})
    .pipe(clean());

});


//tasks method used for gulp
gulp.task('sass', function(){
sassFiles =  gulp.src(SOURCEPATHS.sassApp)
    //autoprefixer
    .pipe(autoprefixer())
    //The gulp task sass will pupe the src/scss/app.scss file
    //changes into the app/css/app.css file
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
      .pipe(concat('app.css'))
      //output can be compressed or minified instead of expanded
      .pipe(gulp.dest(APPPATH.css));

});

gulp.task('images', function() {
  return gulp.src(SOURCEPATHS.imgSource)
    .pipe(newer(APPPATH.img))
    .pipe(imagemin())
    .pipe(gulp.dest(APPPATH.img));
});


gulp.task('scripts', ['clean-scripts'], function() {
  gulp.src(SOURCEPATHS.jsSource)
    .pipe(concat('main.js'))
    .pipe(browserify())
    .pipe(gulp.dest(APPPATH.js))
});

// production task

gulp.task('compress', function() {
  gulp.src(SOURCEPATHS.jsSource)
    .pipe(concat('main.js'))
    .pipe(browserify())
    .pipe(minify())
    .pipe(gulp.dest(APPPATH.js))
});

gulp.task('compresscss', function(){

sassFiles =  gulp.src(SOURCEPATHS.sassSource)
    .pipe(autoprefixer())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
      .pipe(concat('app.css'))
      .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest(APPPATH.css));

});

gulp.task('minifyHtml', function() {
  return gulp.src(SOURCEPATHS.htmlSource)
    .pipe(injectPartials())
    .pipe(htmlmin({collapseWhitespace:true}))
    .pipe(gulp.dest(APPPATH.root))

});

// end of production task

//Make sure to comment out any instances of copy when using inject partials
gulp.task('html', function() {
  return gulp.src(SOURCEPATHS.htmlSource)
    .pipe(injectPartials())
    .pipe(gulp.dest(APPPATH.root))

});


//GULP TASK TO COPY HTML FILES FROM APP to SRC
// gulp.task('copy', ['clean-html'], function() {
//   gulp.src(SOURCEPATHS.htmlSource)
//     .pipe(gulp.dest(APPPATH.root))
// });

//GULP TASK TO START UP SASS
gulp.task('serve', ['sass'], function() {
  browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
    server : {
      baseDir : APPPATH.root
    }
  })
  //initializes browserSync
});


//GULP TASK TO START UP ALL TASKS
gulp.task('watch', ['serve', 'sass',  'clean-html', 'clean-scripts', 'scripts', 'images', 'html'], function () {
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  // gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
  gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
  gulp.watch([SOURCEPATHS.imgSource], ['images']);
  gulp.watch([SOURCEPATHS.htmlSource, SOURCEPATHS.htmlPartialSource], ['html']);
});

gulp.task('default',['watch'] );
//['*task', 'task2', ...] tasks will run with defult gulp command


gulp.task('production', ['minifyHtml', 'compresscss', 'compress']);
