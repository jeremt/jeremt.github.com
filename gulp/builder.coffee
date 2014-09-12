
path        = require "path"
notify      = require "gulp-notify"

class Builder

  constructor: ->
    @watchList = {}

  # Add the root paths to the given `files`, and add them to the watchList.
  #
  # @param rule {String> the watchlist's rule name to update
  # @param files {Array<String>} the files to add
  #
  addFiles: (rule, files) ->
    throw new Error "Please, provide files to add." if not files?
    @watchList[rule] = (@watchList[rule] ? []).concat(
      path.join(@src, f) for f in files
    )

  # Notify the error and end the current task.
  #
  # @param {Any...} args the arguments of the notification callback
  #
  handleError: (args...) ->
    notify.onError(
      title: "Compile Error",
      message: "<%= error.message %>"
    ).apply(@, args)
    @emit('end')

module.exports = Builder