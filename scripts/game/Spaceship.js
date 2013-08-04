
~function () {

/**
 * Spaceship constructor, create a spaceship mesh.
 */
function Spaceship(cb, scene) {
  var self, _loader, _texture;

  // some variables.

  self = this;
  self.scene = scene;
  self.loaded = false;
  self.camera = null;

  self.target = new THREE.Vector3(0, 0, 0);

  // shoot

  self.fireballs = [];
  self._currentShootTime = 1000;
  self.shootTime = 200;

  // texture

  _texture = new THREE.Texture();

  _loader = new THREE.ImageLoader();
  _loader.addEventListener('load', function (event) {
    _texture.image = event.content;
    _texture.needsUpdate = true;
  });
  _loader.load('resources/textures/ship_01.png');

  // model

  _loader = new THREE.OBJLoader();
  _loader.addEventListener('load', function (event) {
    self.mesh = event.content;
    self.mesh.traverse(function (child) {
      if (child instanceof THREE.Mesh)
        child.material.map = _texture;
    });
    self.mesh.rotation.z = Math.PI / 2;
    self.loaded = true;
    cb && cb.call(self);
  });
  _loader.load('resources/models/ship_01.obj');
}

/**
 * Attach the given camera to this spaceship.
 */
Spaceship.prototype.attachCamera = function (camera) {
  this.camera = camera;
}

/**
 * Send a missile.
 */
Spaceship.prototype.shoot = function (deltaTime) {
  if (this._currentShootTime < this.shootTime)
    this._currentShootTime += deltaTime;
  else {
    this._currentShootTime = 0;
    var fireball = new Fireball(this);
    this.scene.add(fireball.mesh);
    this.fireballs.push(fireball);
    this.mesh.position.z += 10;
  }
}

/**
 * Check if we destroy an asteroide.
 */
Spaceship.prototype.destroyAsteroide = function (emitter) {
  for (var i = this.fireballs.length - 1; i >= 0; --i) {
    if (emitter.hit(this.fireballs[i].mesh.position)) {
      this.scene.remove(this.fireballs[i].mesh);
      this.fireballs.splice(i, 1);
      return true;
    }
  }
  return false;
}

/**
 * Update the spaceship according keyboard events.
 */
Spaceship.prototype.update = function(deltaTime, keyboard) {
  if (this.loaded == false)
    return ;

  // Update the position according keyboard events.

  if (keyboard.pressed("left"))
    this.target.x -= 0.1 * deltaTime;
  if (keyboard.pressed("right"))
    this.target.x += 0.1 * deltaTime;
  if (keyboard.pressed("up"))
    this.target.y += 0.1 * deltaTime;
  if (keyboard.pressed("down"))
    this.target.y -= 0.1 * deltaTime;
  if (keyboard.pressed("space"))
    this.shoot(deltaTime);

  // Handle movement limits.

  if (this.target.x < -40)
    this.target.x = -40;
  if (this.target.x > 40)
    this.target.x = 40;
  if (this.target.y < -40)
    this.target.y = -40;
  if (this.target.y > 40)
    this.target.y = 40;

  this.mesh.position.lerp(this.target, 0.05);

  // Update fireballs.

  for (var i = this.fireballs.length - 1; i >= 0; --i) {
    if (this.fireballs[i].move(deltaTime) === false) {
      this.scene.remove(this.fireballs[i].mesh);
      this.fireballs.splice(i, 1);
    }
  }

  // If we attach a camera, follow the spaceship.

  if (this.camera !== null) {
    this.cameraTarget = this.mesh.position.clone();
    this.cameraTarget.z += 50;
    this.camera.position.lerp(this.cameraTarget, 0.1);
  }
}

window.Spaceship = Spaceship;

}();