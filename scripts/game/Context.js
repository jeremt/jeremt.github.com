
~function () {

/**
 * Create a new context and initialize the application.
 */
function Context() {
  var self = this;

  this.effectManager = null;
  this.paused = false;

  // Create html container.

  var container = document.createElement('div');
  document.body.appendChild(container);

  // Create camera.

  this.camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 1, 2000
  );

  // Create scene.

  this.scene = new THREE.Scene();

  // Create the renderer.

  this.renderer = new THREE.WebGLRenderer();
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(this.renderer.domElement);

  window.addEventListener('resize', function () {
    self.camera.aspect = window.innerWidth / window.innerHeight;
    self.camera.updateProjectionMatrix();
    self.renderer.setSize(window.innerWidth, window.innerHeight);
  }, false);

  // Create keyboard event handler.

  this.keyboard = new KEvent;
}

/**
 * Handle events.
 */
EventEmitter.create(Context);

Context.prototype.attachEffectManager = function (effectManager) {
  this.effectManager = effectManager;
}

Context.prototype.pause = function () {
  this.paused = true;
}

Context.prototype.play = function () {
  this.paused = false;
}

/**
 * Set fps.
 */
Context.prototype.setFPS = function (fps) {
  this.fps = fps;
}

/**
 * Start the application.
 */
Context.prototype.start = function () {
  var self = this;
  var then = new Date().getTime();

  this.fps || (this.fps = 60);
  var interval = 1000 / this.fps;
  this.trigger("start");
  ~function animate() {
    requestAnimationFrame(animate);
    var now = new Date().getTime();
    var delta = now - then;

    if (delta > interval) {
      then = now - (delta % interval);
      self.trigger("frame", delta);
      if (!this.paused) {
        if (self.effectManager)
          self.effectManager.render();
        else
          self.renderer.render(self.scene, self.camera);
      }
    }
  }();
}

window.Context = Context;

}();