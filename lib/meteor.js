
~function () {

/**
 * All generated meteors
 */

var meteors = {}
  , i = 0
  , imgs = [
      'img/game/bilbo.png'
    , 'img/game/boilertek.png'
    , 'img/game/contact.png'
    , 'img/game/fb.png'
    , 'img/game/gh.png'
    , 'img/game/gplus.png'
    , 'img/game/in.png'
    , 'img/game/mail.png'
    , 'img/game/origami.png'
    , 'img/game/resume.png'
    , 'img/game/rt.png'
    , 'img/game/rtb.png'
    , 'img/game/twitter.png'
    , 'img/game/website.png'
    , 'img/game/work.png'
  ]

/**
 * Create a new meteor.
 *
 * @param {String} meteor's name
 * @param {Object} the tQuery world reference
 */

function Meteor(name, world) {
  this.world = world
  this.destroyed = false

  this.mesh = tQuery.createCube().addTo(world)
  this.mesh.get(0).name = name
  this.mesh
    .addClass('meteor')
    .translateZ(-20)
    .translateX(Math.random() * 10 - 5)
    .translateY(Math.random() * 10 - 5)
    .scaleY(0.01)
    .receiveShadow(true)
    .translateY(-0.2-0.1)
    .setLambertMaterial()
    .map(imgs[~~(Math.random() * imgs.length)]).ambient(0x444444).back()


  this.moveX = this.mesh.get(0).position.x > 0 ? -1 : 1
  this.moveY = this.mesh.get(0).position.y > 0 ? -1 : 1
  this.rotX = (Math.random() - 0.5) / 10
  this.rotY = (Math.random() - 0.5) / 10
  this.rotZ = (Math.random() - 0.5) / 10
}

/**
 * Add a new meteor
 */

Meteor.spawn = function (world) {
  meteors['m' + i] = new Meteor('m' + i, world)
  ++i
}

/**
 * Return a meteor according its name.
 *
 * @param {String} meteor's name
 */

Meteor.get = function (name) {
  return meteors[name]
}

/**
 * Parse each meteor
 */

Meteor.each = function (fn) {
  for (var key in meteors)
    if (meteors[key].destroyed === false)
      fn.call(meteors[key], meteors[key])
}

/**
 * Reset meteors
 */

Meteor.empty = function () {
  meteors = {}
}

/**
 * Update meteor position.
 */

Meteor.prototype.move = function () {
  this.mesh.translateZ(0.05)

  if (this.moveX === 1 && this.mesh.get(0).position.x < 0)
    this.mesh.translateX(0.01)
  else if (this.moveX === -1 && this.mesh.get(0).position.x > 0)
    this.mesh.translateX(-0.01)

  if (this.moveY === 1 && this.mesh.get(0).position.y < 0)
    this.mesh.translateY(0.01)
  else if (this.moveY === -1 && this.mesh.get(0).position.y > 0)
    this.mesh.translateY(-0.01)

  this.mesh.rotate(this.rotX, this.rotY, this.rotZ)
}

/**
 * Destroy the meteor.
 */

Meteor.prototype.destroy = function () {
  this.destroyed = true
  this.mesh.removeClass('meteor')
  this.mesh.removeFrom(this.world)
}

/**
 * Check collide between the meteor and another mesh.
 *
 * @param {Object} the other mesh
 */

Meteor.prototype.hit = function (mesh) {
  if (this.destroyed) return false
  if (this.mesh.get(0).position.z > mesh.position.z)
    return this.destroyed = true
}

window.Meteor = Meteor

}()