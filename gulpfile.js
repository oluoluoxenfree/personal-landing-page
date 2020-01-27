var gulp = require("gulp");
var sass = require("gulp-sass");
var serve = require("gulp-serve");
var fs = require("fs");
var del = require("del");
var cp = require("child_process");

// what goes where?
var buildSrc = "src";
var buildDest = "dist";

// cleanup the build output
const init = function(done) {
  // Look for the environment variables
  if (process.env.URL) {
    var siteEnv = { rootURL: process.env.URL };
  } else {
    var siteEnv = { rootURL: "https://olu.ooo" };
  }

  // save the status of our environment somewhere that our SSG can access it

  const write = () => {
    fs.writeFileSync(
      `${buildSrc}/site/_data/site.json`,
      JSON.stringify(siteEnv),
      function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        console.log(err);
      }
    );
    done();
  };

  return write();
};

// cleanup the build output
const cleanBuild = async function() {
  return await del([`${buildDest}/*`]);
};

// local webserver for development
gulp.task(
  "serve",
  serve({
    root: [buildDest],
    port: 8008
  })
);

// Compile SCSS files to CSS
const scss = function() {
  return gulp
    .src(buildSrc + "/scss/main.scss")
    .pipe(
      sass({
        outputStyle: "compressed"
      }).on("error", sass.logError)
    )
    .pipe(gulp.dest(buildDest + "/css"));
};

/*
  Run our static site generator to build the pages
*/
const generate = function(done) {
  return cp.exec("eleventy --config=eleventy.js", function(
    err,
    stdout,
    stderr
  ) {
    console.log(stdout);
    console.log(stderr);
    done(err);
  });
};

/*
  Watch src folder for changes
*/
const watch = function(done) {
  gulp.watch(buildSrc + "/**/*", ["build"]);
  done();
};

/*
  Let's build this sucker.
*/
exports.build = gulp.series(cleanBuild, init, generate, scss);
