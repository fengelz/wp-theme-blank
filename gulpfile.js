require("@babel/register")
const gulp = require('gulp')
const sass = require('gulp-sass')
const sassGlob = require('gulp-sass-glob')
const path = require('path')
const flatten = require('gulp-flatten')
const reactRender = require('gulp-render-react')
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const gls = require('gulp-live-server')
var rename = require("gulp-rename")
var replace = require('gulp-replace')

gulp.task('default', [
  'build-html',
  'build-sass',
  'copy-assets',
  'init',
])

const paths = {
  components: path.join(__dirname, 'src/components/'),
  scss: path.join(__dirname, 'src/scss/'),
  assets: path.join(__dirname, 'src/assets/'),
  public: path.join(__dirname, 'dist/theme-blank/')
}

gulp.task('build-public', ['build-html', 'build-sass', 'copy-assets'])

gulp.task('build-html', () => {
  gulp.src(paths.components + 'pages/**/*.js')
    .pipe(reactRender({type: 'markup'}))
    .pipe(rename(function (path) {
      path.extname = ".php";
    }))
    .pipe(replace('&lt;?', '<?'))
    .pipe(replace('?&gt;', '?>'))
    .pipe(flatten())
    .pipe(gulp.dest(paths.public))
})

gulp.task('build-sass', () => {
  return gulp
    .src(paths.scss + '/styles.scss')
    .pipe(sassGlob())
    .on('error', onError)
    .pipe(
      sass({
        includePaths: [],
      })
    )
    .on('error', onError)
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false,
      })
    )
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.public + '/assets/css/'))
})

gulp.task('copy-assets', () => {
  gulp.src([ paths.assets + '**/*' ])
  .pipe(gulp.dest(paths.public))
})

gulp.task('init', () => {
  gulp.watch(paths.scss + '**/*.scss', ['build-sass'])
  gulp.watch(paths.components + '**/*.scss', ['build-sass'])
  gulp.watch(paths.components + '**/*.js', ['build-html'])
  gulp.watch(paths.assets + '**/*.*', {cwd: './'}, ['copy-assets'])
})

function onError(error) {
  console.log("ERROR:", error.message)
  if (error.plugin) {
    console.log('Plugin: ' + error.plugin)
  }
  this.emit('end')
}