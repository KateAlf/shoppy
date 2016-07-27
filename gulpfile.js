"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");

var postcss = require("gulp-postcss");
var cssnext = require("postcss-cssnext");
var precss = require("precss");
// var atImport = require("postcss-import");
var mqpacker = require("css-mqpacker");
var cssnano = require("cssnano");
var postcsscenter = require("postcss-center");
var stylelint = require("stylelint");
var stylefmt = require("stylefmt");
var postcsssorting = require("postcss-sorting");

var fileinclude = require('gulp-file-include');

var imagemin = require("gulp-imagemin");
var svgmin = require("gulp-svgmin");

var copy = require("gulp-contrib-copy");
var clean = require("gulp-contrib-clean");

var server = require("browser-sync");

gulp.task("style", function () {
  var processors = [
    cssnext,
    precss,
    // atImport,
    postcsscenter,
    postcsssorting,
    mqpacker ({
        sort: true })
    /*cssnano*/
  ];

  return gulp.src("src/*.css")
    .pipe(postcss(processors))
    .pipe(gulp.dest("dest"));
});

gulp.task('fileinclude', function() {
  gulp.src(['src/index.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./'));
});

gulp.task("images", function () {
  return gulp.src("img/**/*.{png,jpg,gif}")
      .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true
    }))
    .pipe(gulp.dest("build/img"));
});

gulp.task("symbols", function () {
  gulp.src("img/svg/*.svg")
    .pipe(svgmin())
    .pipe(gulp.dest("img/svg/mini"));
});

gulp.task("serve", ["style"], function () {
  server.init({
    server: ".",
    notify: false,
    open: true,
    ui: false
  });
});

gulp.task("clean", function () {
  gulp.src('build', {read: false})
      .pipe(clean());
  });

gulp.task("copy", function () {
  gulp.src("*.html").pipe(gulp.dest("build"));
  gulp.src("dest/*.css").pipe(gulp.dest("build/css"));
  gulp.src("*.json").pipe(gulp.dest("build"));
  gulp.src("fonts/**/*.{woff,woff2}").pipe(gulp.dest("build/fonts"));
  gulp.src("img/**.{png,jpg,gif,svg}").pipe(gulp.dest("build/img"));
  gulp.src("js/**.js").pipe(gulp.dest("build/js"));
});

gulp.watch("src/*.css", ["style"]);
gulp.watch("dest/*.css").on("change", server.reload);
gulp.watch("src/**/*.html", ["fileinclude"]);
gulp.watch("*.html").on("change", server.reload);
gulp.watch("img/*").on("change", server.reload);

gulp.task("build", ["clean", "style", "images", "copy"], function () {
});
