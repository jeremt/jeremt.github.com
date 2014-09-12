
#
# Module dependencies
#

gulp        = require "gulp"
path        = require "path"
coffee      = require "gulp-coffee"
gulpif      = require "gulp-if"

# Utils
clean       = require "gulp-rimraf"

# Markup
jade        = require "gulp-jade"

# Style
stylus      = require "gulp-stylus"
prefix      = require "gulp-autoprefixer"

Builder     = require "./builder"

# Utility to make easier building tasks for a web application. It provides
# features to build:
#
# - coffeescript scripts (with browserify)
# - stylus stylesheets
# - fonts & images
#
class Compiler extends Builder

  DEFAULT_ASSETS_EXTENSIONS = [
    "png", "jpg", "jpeg", "gif" # images
    "eot", "svg", "ttf", "woff" # fonts
  ]

  DEFAULT_PATHS =
    src: "./app"
    dest: "./build"

  # Create the builder.
  #
  # @param {Object} options optional configuration (see DEFAUT_OPTIONS)
  # @param {Object} locals some variables to use in template files
  #
  constructor: ({@src, @dest} = {}, @locals = {}) ->
    Builder.call(@)
    @src ?= DEFAULT_PATHS.src
    @dest ?= DEFAULT_PATHS.dest

  # Build the markup files and add them to the watchlist.
  #
  # @param {Array<String>} pages some pages to compiles
  # @param {Array<String>} partials partials files which aren't compiled
  #
  compileMarkup: ({pages, partials} = {}) ->
    defaultPages = ["index.jade", "{pages,templates}/**/*.jade"]
    files = @addFiles("compileMarkup", pages ? defaultPages)
    gulp.src(files)
      .pipe(jade(basedir: @src, locals: @locals)
        .on('error', @handleError))
      .pipe(gulp.dest(@dest))

  # Build some scripts as single files.
  #
  # @param {Array<String>} scripts the scripts to build
  # @param {String} dest a folder destination for the scripts
  #
  compileScripts: ({scripts, dest} = {}) ->
    dest ?= "."
    coffeestream = coffee(bare: true).on 'error', @handleError
    files = @addFiles("compileScripts", scripts ? ["**/*.{coffee,js}"])
    gulp.src(files)
      .pipe(gulpif(/[.]coffee$/, coffeestream))
      .pipe(gulp.dest(path.join(@dest, dest)))

  # Build css from the given stylus files.
  #
  # @param {String} entry the entry point of the stylesheets
  # @param {Array<String>} styles the list of stylesheets to watch
  #
  compileStyles: (entry = "styles/index.styl", styles) ->
    @addFiles("compileStyles", styles ? ["styles/**/*.styl"])
    gulp.src(path.join(@src, entry))
      .pipe(stylus().on("error", @handleError))
      .pipe(prefix())
      .pipe(gulp.dest(@dest))

  # Move the assets of the application into the build folder.
  #
  # @param {String} folder application's folder which contains all assets
  # @param {Array<String>} ext the allowed extensions to copy
  #
  compileAssets: (folder = "assets/", ext) ->
    ext ?= DEFAULT_ASSETS_EXTENSIONS
    files = @addFiles("compileAssets", ["#{folder}/**/*.{#{ext.join(',')}}"])
    gulp.src(files)
      .pipe(gulp.dest(path.join(@dest, folder)))

  # Remove the build folder and all the files inside recursively.
  #
  clean: ->
    gulp.src(path.join(@dest, "**/*"), read: false)
      .pipe(clean())

module.exports = Compiler
