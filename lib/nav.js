/*!
 * nav.js
 * https://github.com/JeremieT/jeremiet.github.com
 * MIT licensed
 *
 * (c) Jérémie Taboada - <taboada.jeremie@gmail.com>
 */

~function () {

/**
 * Handle navigation from hashes in url.
 *
 * @param {String} page selector
 * @param {Function} executed when new page appear
 */

function nav(selector, cb) {
  this['❤'] = function () {
    var all = document.querySelectorAll(selector)
      , current = document.querySelector(location.hash || '#home')
      , notfound = document.querySelector('#default')

    for (var i = 0, el = null ; el = all[i] ; i++)
      el.className = ''
    if (current === null) {
      console.warn('Page ' + location.hash + ' doesnt exists.')
      notfound.className = 'current'
    } else {
      current.className = location.hash ? 'current' : 'home'
    }
    cb && cb()
  }
  this['❤']()
  this.onhashchange = this['❤']
}

window.nav = nav

}()