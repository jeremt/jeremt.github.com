
gulp      = require "gulp"
path      = require "path"
Builder   = require "./builder"

class Vendors extends Builder

  EXTENSIONS = [
    "png", "jpg", "jpeg", "gif" # images
    "eot", "svg", "ttf", "woff" # fonts
    "js"                        # scripts
    "css"                       # stylesheets
  ]

  DEFAULT_OPTIONS =
    src: "."
    dest: "./app"

  constructor: ({@src, @dest} = {}) ->
    Builder.call(@)
    @src ?= DEFAULT_OPTIONS.src
    @dest ?= DEFAULT_OPTIONS.dest

  # Move the bower components into the build folder.
  #
  # @param {String} folder application's folder which contains the components
  # @param {Array<String>} ext the allowed extensions to copy
  #
  buildBower: (folder = "bower_components/", ext) ->
    ext ?= EXTENSIONS
    files = @addFiles("buildBower", ["#{folder}/**/*.{#{ext.join(',')}}"])
    gulp.src(files)
      .pipe(gulp.dest(path.join(@dest, folder)))

  buildVendors: (folder = "vendors/", ext) ->
    ext ?= EXTENSIONS
    files = @addFiles("buildVendors", ["#{folder}/**/*.{#{ext.join(',')}}"])
    gulp.src(files)
      .pipe(gulp.dest(path.join(@dest, folder)))

module.exports = Vendors