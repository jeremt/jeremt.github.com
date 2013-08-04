
~function () {

var context = new Context();
var gui = new Gui(context);
var hud = new Hud();

context.on("start", function () {
  var self = this;

  // Set camera position

  this.camera.position.z += Core.depth / 2;

  // Create lights.

  var ambient = new THREE.AmbientLight(0x121210);
  this.scene.add(ambient);
  var directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(0, 0, 1).normalize();
  this.scene.add(directionalLight);

  // Create background.
  var bg = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000, 1, 1),
    new THREE.MeshBasicMaterial({
      color: 0xeeeeee
    })
  );
  bg.position.z = -500;
  this.scene.add(bg);

  // Create spaceship.

  this.spaceship = new Spaceship(function () {
    self.scene.add(this.mesh);
  }, this.scene);
  this.spaceship.attachCamera(this.camera);

  // Create grid

  this.box = new Gridbox(Core.width, Core.height, Core.depth);
  this.scene.add(this.box.mesh);

  this.emitter = new AsteroideEmitter(this.scene);

  // Create effect manager.
  var effectManager = new EffectManager(
    this.renderer,
    this.scene,
    this.camera
  );
  this.attachEffectManager(effectManager);
  gui.attachEffectManager(effectManager);
});

context.on("frame", function (deltaTime) {

  // TODO - Faire une gui

  if (!this.paused && this.keyboard.pressed("escape")) {
    gui.pause();
  }

  // Handle gameOver.

  if (this.paused === false && Core.lifes < 0) {
    gui.gameOver(Core.score);
  }

  if (this.paused)
    return ;

  // Update HUD.

  hud.updateLifes(Core.lifes);
  hud.updateScore(Core.score);
  hud.updateBlood(deltaTime);

  // Update game entitites.

  this.emitter.update(deltaTime);
  if (this.spaceship.mesh) {
    if (this.emitter.hit(this.spaceship.mesh.position)) {
      hud.activateBlood();
      Core.lifes--;
      this.spaceship.mesh.position.z += 100;
      this.camera.position.z += 80;
    }
    if (this.spaceship.destroyAsteroide(this.emitter))
      Core.score++;
    this.spaceship.update(deltaTime, this.keyboard);
  }

});

gui.start();
context.start();

}();