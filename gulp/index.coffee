
gulp        = require "gulp"
browserSync = require "browser-sync"
Compiler    = require "./compiler"
Vendors     = require "./vendors"

compiler = new Compiler(src: "./src", dest: "./app")
gulp.task "compileScripts", -> compiler.compileScripts()
gulp.task "compileStyles", -> compiler.compileStyles()
gulp.task "compileMarkup", -> compiler.compileMarkup()
gulp.task "compile", ["compileMarkup", "compileStyles", "compileScripts"]

vendors = new Vendors()
gulp.task "buildBower", -> vendors.buildBower()
gulp.task "buildVendors", -> vendors.buildVendors()
gulp.task "vendors", ["buildVendors", "buildBower"]

gulp.task "build", ["compile", "vendors"]

gulp.task "watch", ["build"], ->
  for task, patterns of compiler.watchList
    for pattern in patterns
      gulp.watch pattern, [task]
  gulp.watch "src/partials/**/*.jade", ["compileMarkup"]

gulp.task('browser-sync', ->
  browserSync({
    server: {
      baseDir: "./"
    }
  })
)

gulp.task "default", ["watch", "browser-sync"]

# build index