/*!
 * pages.js
 * https://github.com/JeremieT/jeremiet.github.com
 * MIT licensed
 *
 * (c) Jérémie Taboada - <taboada.jeremie@gmail.com>
 */

~function () {

var pages = {}
  , arr = []

/**
 * Simple helper to load a file with XHR.
 */

function load(path, cb, loading) {
  var req = new XMLHttpRequest()

  req.open("GET", path)
  req.onreadystatechange = function () {
    if (req.readyState === 4) {
      if (req.status === 200)
        cb(null, req.responseText)
      else
        cb(new Error(req.statusText))
    } else
      loading && loading(req.readyState)
  }
  req.send()
}

/**
 * Add a new page.
 *
 * @param {String} page name
 * @param {Array} add a list of articles into the page
 */

pages.add = function (path, articles) {
  arr.push({path: path, articles: articles})
  return this
}

/**
 * Load the article of a specific page.
 *
 * @param {Object} current page
 * @param {Function} callback
 */

function articles(page, cb) {
  var markup = {sections: '', articles: ''}

  ~function next() {
    if (page.articles.length) {
      var a = page.articles.shift()
      load("pages/" + page.path + "/" + a + ".md", function (err, res) {
        if (err) return cb(err)

        markup.articles += '<article>'
        markup.articles +=   '<a href="#' + a + '" class="card">'
        markup.articles +=     marked(res)
        markup.articles +=   '</a>'
        markup.articles += '</article>'

        markup.sections += '<section id="' + a + '" class="article">'
        markup.sections +=   '<a href="#' + page.path
        markup.sections +=   '" class="icon-remove-sign"></a>'
        markup.sections +=   marked(res)
        markup.sections += '</section>'

        next()
      })
    } else
      cb(null, markup)
  }()
}

/**
 * Executed when all files are added.
 *
 * @param {HTMLElement} el to append the pages
 * @param {Function} callback
 */

pages.generate = function (el, cb) {
  ~function next() {
    if (arr.length) {
      var page = arr.shift()

      // load the `page`
      load("pages/" + page.path + ".md", function (err, res) {
        // if error return it
        if (err) return cb(err)

        // else create a new page
        var section = document.createElement('section')
          , close = '<a href="#" class="icon-remove-sign"></a>'
        section.id = page.path

        // add some articles into the page
        if (page.articles) {
          return articles(page, function (err, markup) {
            if (err) return cb(err)

            // add articles into the page
            section.innerHTML = close + marked(res)
              .replace('{{articles}}', markup.articles)
            el.appendChild(section)

            // add articles pages
            el.innerHTML += markup.sections
            next()
          })
        }

        // and append it to the parent `el`
        section.innerHTML = close + marked(res)
        el.appendChild(section)
        next()
      })
    } else cb()
  }()
}

window.pages = pages

}()/*!
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

}()/*!
 * index.js
 * https://github.com/JeremieT/jeremiet.github.com
 * MIT licensed
 *
 * (c) Jérémie Taboada - <taboada.jeremie@gmail.com>
 */

~function () {

/**
 * Load pages
 */

pages
  .add('work', ['my', 'origami', 'bilbo', 'rt', 'raphael-toolbox', 'more'])
  .add('cv')
  .add('contact')
  .generate(document.body, function (err) {
    if (err) document.body.innerHTML = '<p class="error">' + err + '</p>'
    else nav('body > section')
  })

}()