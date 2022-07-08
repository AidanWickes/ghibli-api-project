// list dependencies
const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const minify = require("gulp-minify");
const terser = require("gulp-terser");
const imageMin = require("gulp-imagemin");
const imageWebp = require("gulp-imagewebp");

// define tasks
// compile sass
function compileSass() {
  return src("src/scss/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer("last 2 versions"))
    .pipe(minify())
    .pipe(dest("dist/css"));
}

// minify js
function minifyJs() {
  return src("src/js/*.js").pipe(terser()).pipe(dest("dist/js"));
}

// minify images
function minifyImages() {
  return src("src/img/assets/*{jpeg,jpg,png}")
    .pipe(
      imageMin([
        imageMin.mozjpeg({ quality: 75, progressive: true }),
        imageMin.optipng({ optimizationLevel: 5 }),
      ])
    )
    .pipe(dest("dist/img"));
}

// convert images to webp
function convertImagesToWebp() {
  return src("dist/img/*{jpeg,jpg,png}")
    .pipe(imageWebp())
    .pipe(dest("dist/img"));
}

// watch for changes
function watchFiles() {
  watch("src/scss/*.scss", compileSass);
  watch("src/js/*.js", minifyJs);
  watch("src/img/*{jpeg,jpg,png}", minifyImages);
  watch("dist/img/*{jpeg,jpg,png}", convertImagesToWebp);
}

// define default task
exports.default = series(
  compileSass,
  minifyJs,
  minifyImages,
  convertImagesToWebp,
  watchFiles
);
