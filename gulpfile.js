var gulp = require("gulp");
var sass = require("gulp-sass");
var serve = require("gulp-serve");
var shell = require("gulp-shell");
var clean = require("gulp-clean");
var fs = require("fs");

// what goes where?
var buildSrc = "src";
var buildDest = "dist";

// cleanup the build output
function init() {
  // Look for the environment variables
  if (process.env.URL) {
    var siteEnv = { rootURL: process.env.URL };
  } else {
    var siteEnv = { rootURL: "https://olu.ooo" };
  }

  // save the status of our environment somewhere that our SSG can access it
  return fs.writeFile(
    buildSrc + "/site/_data/site.json",
    JSON.stringify(siteEnv),
    function(err) {
      if (err) {
        console.log(err);
      }
    }
  );
}

// cleanup the build output
function cleanBuild() {
  return del([buildDest]);
}

// local webserver for development
gulp.task(
  "serve",
  serve({
    root: [buildDest],
    port: 8008
  })
);

// Compile SCSS files to CSS
function scss() {
  return gulp
    .src(buildSrc + "/scss/main.scss")
    .pipe(
      sass({
        outputStyle: "compressed"
      }).on("error", sass.logError)
    )
    .pipe(gulp.dest(buildDest + "/css"));
}

/*
 Run our static site generator to build the pages
*/
function generate(done) {
  shell.task("eleventy --config=eleventy.js");
  done();
}

/*
  Watch src folder for changes
*/
gulp.task("watch", function(done) {
  gulp.watch(buildSrc + "/**/*", ["build"]);
  done();
});

/*
  Let's build this sucker.
*/
gulp.task("build", function(done) {
  return gulp.series(cleanBuild, init, generate, scss), done();
});
