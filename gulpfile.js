var gulp = require("gulp");
var sass = require("gulp-sass");
var serve = require("gulp-serve");
var shell = require("gulp-shell");
var clean = require("gulp-clean");
var runSequence = require("run-sequence");
var request = require("request");
var fs = require("fs");
var config = require("dotenv").config();

// what goes where?
var buildSrc = "src";
var buildDest = "dist";

// cleanup the build output
function init(done) {
  // Look for the environment variables
  if (process.env.URL) {
    var siteEnv = { rootURL: process.env.URL };
  } else {
    var siteEnv = { rootURL: "https://olu.ooo" };
  }

  // save the status of our environment somewhere that our SSG can access it
  fs.writeFile(
    buildSrc + "/site/_data/site.json",
    JSON.stringify(siteEnv),
    function(err) {
      if (err) {
        console.log(err);
      }
    }
  );
  done();
}

// cleanup the build output
function cleanBuild(done) {
  gulp.src(buildDest, { read: false }).pipe(clean());
  done();
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
function scss(done) {
  gulp
    .src(buildSrc + "/scss/main.scss")
    .pipe(
      sass({
        outputStyle: "compressed"
      }).on("error", sass.logError)
    )
    .pipe(gulp.dest(buildDest + "/css"));
  done();
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
gulp.task("watch", function() {
  gulp.watch(buildSrc + "/**/*", ["build"]);
});

/*
  Let's build thus sucker.
*/
gulp.task("build", function(done) {
  gulp.parallel(cleanBuild, init), gulp.parallel(generate, scss), done();
});
