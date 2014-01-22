
~function () {

function ThemeLoader(arr) {
  this._themes = arr || [];
}

ThemeLoader.prototype.loadTheme = function (filename) {
  var link=document.createElement("link")
  link.setAttribute("rel", "stylesheet")
  link.setAttribute("type", "text/css")
  link.setAttribute("href", filename)
  var index = document.getElementsByTagName("link")
  var head = document.getElementsByTagName("head")[0]
  head.insertBefore(link, head.firstChild)
}

ThemeLoader.prototype.randomTheme = function () {
  var th = this._themes[~~(Math.random() * this._themes.length)]
  this.loadTheme(th)
}

window.ThemeLoader = ThemeLoader

}()
