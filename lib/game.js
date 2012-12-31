/*!
 * game.js
 * https://github.com/jeremt
 * MIT licensed
 *
 * (c) Jérémie Taboada - <taboada.jeremie@gmail.com>
 */

~function () {

// create the game object

window.game || (window.game = {})

var world
  , scoreEL
  , lifeEl
  , exit

/**
 * Initialize the game
 *
 * @param {Object} options
 * @option opts {HTMLElement} the Dom element to append score
 * @option opts {HTMLElement} the Dom element to append score
 */

game.init = function (opts) {
  lifes = 3
  score = 0
  scoreEl = opts.score
  lifesEl = opts.lifes
  exit = opts.exit

  // world

  world = tQuery.createWorld().boilerplate({stats: false})

  // camera

  world.removeCameraControls()
  world.tRenderer().setClearColorHex(0,0)

  // create asteroide

  Meteor.spawn(world)
  Meteor.spawn(world)
  Meteor.spawn(world)
  Meteor.spawn(world)

  // lights

  tQuery.createAmbientLight().addTo(world).color(0x444444)
  tQuery.createPointLight().addTo(world).intensity(1).distance(30);
  tQuery.createDirectionalLight().addTo(world)
    .position(2, 4, -1.5).color(0xffffff)
    .castShadow(true)
    .shadowDarkness(0.7).shadowBias(.002)

  // listen events

  world.enableDomEvent()

  // spawn meteors

  ~function spawnMeteors() {
    Meteor.spawn(world)
    tQuery('.meteor').on('click', function (e) {
      // trouver comment ne pas clicker sur les truc detruits (p-e remove class .meteor)
      Meteor.get(e.target.name).destroy()
      ++score
      scoreEl.innerHTML = score
    })
    setTimeout(spawnMeteors, 2000)
  }()

  // update scene

  world.loop().hook(function (delta, now) {
    Meteor.each(function () {
      this.move()
      if (this.hit(world.tCamera())) {
        lifesEl.innerHTML = --lifes
        if (lifes === 0) {
          world.stop()
          game.exit()
        }
      }
    })
  })
}

/**
 * Start the game
 */

game.start = function () {
  world.start()
}

/**
 * Stop the game
 */

game.stop = function () {
  world.stop()
}

/**
 * Reset the game
 */

game.exit = function () {
  alert('Congratulation you made: ' + score)
  location.reload()
}

}()