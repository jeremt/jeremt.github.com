
~function () {

console.log("Bonjour :)")

pages
  .add('work', [
      'my'
    , 'boilertek'
    , 'bilbo'
    , 'rt'
    , 'raphael-toolbox'
    , 'shell'
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

function konamiCode() {
  var pages = document.querySelectorAll('section')
    , menu  = document.querySelector('#menu')
    , play  = document.querySelector('#menu #play')
    , exit  = document.querySelector('#menu #exit')

  // Hide all website pages

  for (var i = 0; i < pages.length; i++)
    pages[i].style.display = 'none'

  // Show menu

  menu.style.display = 'block'

  // Start the game

  game.init({
    score: document.querySelector('#menu #score'),
    lifes: document.querySelector('#menu #lifes')
  })

  game.start()

  // Menu events

  play.onclick = function () {
    if (play.className === 'icon-pause') {
      play.className = 'icon-play'
      game.stop()
    } else {
      play.className = 'icon-pause'
      game.start()
    }
  }

  exit.onclick = function () {
    game.exit()
  }

}

jwerty.key('↑,↑,↓,↓,←,→,←,→,B,A,↩', konamiCode)

}()