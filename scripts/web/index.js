
~function () {

var loading = document.querySelector("#loading")
loading.style.display = 'none'

document.querySelector("#quote").innerHTML =
  quotes[~~(Math.random() * quotes.length)]

pages
  .add('work', [
      'jeremt'
    , 'bilbo'
    , 'origami'
    , 'spaceship'
    , 'marioversusboo'
    , 'more'
    ])
  .add('cv')
  .add('contact')
  .add('businesscard')
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
