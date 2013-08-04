
~function () {

var loading = document.querySelector("#loading")
loading.style.display = 'none'

pages
  .add('work', [
      'bilbo'
    , 'origami'
    , 'spaceship'
    , 'more'
    ])
  .add('cv')
  .add('contact')
  .generate(document.body, function (err) {
    if (err)
      return document.body.innerHTML = '<p class="error">' + err + '</p>'
    nav('body > section')

    // open external links into a new window
    var a = document.querySelectorAll('a[href^="http"]')
    for (var i = 0; i < a.length; i++)
      a[i].target = "_blank"
  })

jwerty.key('↑,↑,↓,↓,←,→,←,→,B,A,↩', function () {
  window.location.replace("game.html")
})

}()